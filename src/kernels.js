import $ from "jquery";
import CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";

import { mergeOptions } from "./options";
import * as events from "./events";

// make CodeMirror public for loading additional themes
if (typeof window !== "undefined") {
  window.CodeMirror = CodeMirror;
}

import { KernelManager, KernelAPI } from "@jupyterlab/services";
import { ServerConnection } from "@jupyterlab/services";

import { WebSocket } from "mock-socket";

import {
  WIDGET_MIMETYPE,
  WidgetRenderer,
} from "@jupyter-widgets/html-manager/lib/output_renderers";

export function hookupKernel(kernel, cells, manager) {
  // hooks up cells to the kernel
  cells.map((i, { cell }) => {
    $(cell).data("kernel-promise-resolve")(kernel);

    const renderMime = $(cell).data("renderMime");
    renderMime.addFactory(
      {
        safe: false,
        mimeTypes: [WIDGET_MIMETYPE],
        createRenderer: (options) => new WidgetRenderer(options, manager),
      },
      1
    );
  });
}

// requesting Kernels
export function requestKernel(kernelOptions) {
  // request a new Kernel
  kernelOptions = mergeOptions({ kernelOptions }).kernelOptions;
  let serverSettings = ServerConnection.makeSettings(
    kernelOptions.serverSettings
  );

  events.trigger("status", {
    status: "starting",
    message: "Starting Kernel",
  });

  if (thebelab.jupyterlite) {
    server = thebelab.jupyterlite.server;
    serverSettings = {
      ...serverSettings,
      WebSocket,
      fetch: server.fetch.bind(server) ?? undefined,
    };
  }

  let km = new KernelManager({ serverSettings, WebSocket });
  return km.ready
    .then(() => {
      return km.startNew(kernelOptions);
    })
    .then((kernel) => {
      events.trigger("status", {
        status: "ready",
        message: "Kernel is ready",
        kernel: kernel,
      });
      return kernel;
    });
}

export function requestBinderKernel({ binderOptions, kernelOptions }) {
  // request a Kernel from Binder
  // this strings together requestBinder and requestKernel.
  // returns a Promise for a running Kernel.
  return requestBinder(binderOptions).then((serverSettings) => {
    kernelOptions.serverSettings = serverSettings;
    return requestKernel(kernelOptions);
  });
}

export function requestBinder({
  repo,
  ref = "master",
  binderUrl = null,
  repoProvider = "",
  savedSession = _defaultOptions.binderOptions.savedSession,
} = {}) {
  // request a server from Binder
  // returns a Promise that will resolve with a serverSettings dict

  // populate from defaults
  let defaults = mergeOptions().binderOptions;
  if (!repo) {
    repo = defaults.repo;
    repoProvider = "";
  }
  console.log("binder url", binderUrl, defaults);
  binderUrl = binderUrl || defaults.binderUrl;
  ref = ref || defaults.ref;
  savedSession = savedSession || defaults.savedSession;
  savedSession = $.extend(true, defaults.savedSession, savedSession);

  let url;

  if (repoProvider.toLowerCase() === "git") {
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");
    //convert to URL acceptable string. Required for git
    repo = encodeURIComponent(repo);

    url = binderUrl + "/build/git/" + repo + "/" + ref;
  } else if (repoProvider.toLowerCase() === "gitlab") {
    // trim gitlab.com from repo
    repo = repo.replace(/^(https?:\/\/)?gitlab.com\//, "");
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");
    //convert to URL acceptable string. Required for gitlab
    repo = encodeURIComponent(repo);

    url = binderUrl + "/build/gl/" + repo + "/" + ref;
  } else {
    // trim github.com from repo
    repo = repo.replace(/^(https?:\/\/)?github.com\//, "");
    // trim trailing or leading '/' on repo
    repo = repo.replace(/(^\/)|(\/?$)/g, "");
    // trailing / on binderUrl
    binderUrl = binderUrl.replace(/(\/?$)/g, "");

    url = binderUrl + "/build/gh/" + repo + "/" + ref;
  }
  console.log("Binder build URL", url);

  const storageKey = savedSession.storagePrefix + url;

  async function getExistingServer() {
    if (!savedSession.enabled) {
      return;
    }
    let storedInfoJSON = window.localStorage.getItem(storageKey);
    if (storedInfoJSON == null) {
      console.debug("No session saved in ", storageKey);
      return;
    }
    console.debug("Saved binder session detected");
    let existingServer = JSON.parse(storedInfoJSON);
    let lastUsed = new Date(existingServer.lastUsed);
    let ageSeconds = (new Date() - lastUsed) / 1000;
    if (ageSeconds > savedSession.maxAge) {
      console.debug(
        `Not using expired binder session for ${existingServer.url} from ${lastUsed}`
      );
      window.localStorage.removeItem(storageKey);
      return;
    }
    let settings = ServerConnection.makeSettings({
      baseUrl: existingServer.url,
      wsUrl: "ws" + existingServer.url.slice(4),
      token: existingServer.token,
      appendToken: true,
    });
    try {
      await KernelAPI.listRunning(settings);
    } catch (err) {
      console.log(
        "Saved binder connection appears to be invalid, requesting new session",
        err
      );
      window.localStorage.removeItem(storageKey);
      return;
    }
    // refresh lastUsed timestamp in stored info
    existingServer.lastUsed = new Date();
    window.localStorage.setItem(storageKey, JSON.stringify(existingServer));
    console.log(
      `Saved binder session is valid, reusing connection to ${existingServer.url}`
    );
    return settings;
  }

  return new Promise(async (resolve, reject) => {
    // if binder already spawned our server and we remember the creds
    // try to reuse it
    let existingServer;
    try {
      existingServer = await getExistingServer();
    } catch (err) {
      // catch unhandled errors such as JSON parse errors,
      // invalid formats, permission error on localStorage, etc.
      console.error("Failed to load existing server connection", err);
    }

    if (existingServer) {
      // found an existing server
      // return it instead of requesting a new one
      resolve(existingServer);
      return;
    }

    events.trigger("status", {
      status: "building",
      message: "Requesting build from binder",
    });

    let es = new EventSource(url);
    es.onerror = (err) => {
      console.error("Lost connection to " + url, err);
      es.close();
      events.trigger("status", {
        status: "failed",
        message: "Lost connection to Binder",
        error: err,
      });
      reject(new Error(err));
    };
    let phase = null;
    es.onmessage = (evt) => {
      let msg = JSON.parse(evt.data);
      if (msg.phase && msg.phase !== phase) {
        phase = msg.phase.toLowerCase();
        console.log("Binder phase: " + phase);
        let status = phase;
        if (status === "ready") {
          status = "server-ready";
        }
        events.trigger("status", {
          status: status,
          message: "Binder is " + phase,
          binderMessage: msg.message,
        });
      }
      if (msg.message) {
        console.log("Binder: " + msg.message);
      }
      switch (msg.phase) {
        case "failed":
          console.error("Failed to build", url, msg);
          es.close();
          reject(new Error(msg));
          break;
        case "ready":
          es.close();
          try {
            // save the current connection url+token to reuse later
            window.localStorage.setItem(
              storageKey,
              JSON.stringify({
                url: msg.url,
                token: msg.token,
                lastUsed: new Date(),
              })
            );
          } catch (e) {
            // storage quota full, gently ignore nonfatal error
            console.warn(
              "Couldn't save thebe binder connection info to local storage",
              e
            );
          }

          resolve(
            ServerConnection.makeSettings({
              baseUrl: msg.url,
              wsUrl: "ws" + msg.url.slice(4),
              token: msg.token,
              appendToken: true,
            })
          );
          break;
        default:
        // console.log(msg);
      }
    };
  });
}
