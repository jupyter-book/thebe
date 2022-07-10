import { KernelAPI, ServerConnection } from '@jupyterlab/services';
import { BasicServerSettings, BinderOptions, SavedSessionOptions, ServerInfo } from './types';

export function makeStorageKey(storagePrefix: string, url: string) {
  return storagePrefix + url;
}

export function removeServerInfo(savedSession: SavedSessionOptions, url: string) {
  window.localStorage.removeItem(makeStorageKey(savedSession.storagePrefix, url));
}

export function updateLastUsedTimestamp(savedSession: SavedSessionOptions, url: string) {
  const storageKey = makeStorageKey(savedSession.storagePrefix, url);
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return;
  const obj = JSON.parse(saved);
  window.localStorage.setItem(storageKey, JSON.stringify({ ...obj, lastUsed: new Date() }));
}

export function saveServerInfo(
  savedSession: SavedSessionOptions,
  url: string,
  serverSettings: BasicServerSettings
) {
  try {
    // save the current connection url+token to reuse later
    window.localStorage.setItem(
      makeStorageKey(savedSession.storagePrefix, url),
      JSON.stringify({
        ...serverSettings,
        lastUsed: new Date(),
      })
    );
  } catch (e) {
    // storage quota full, gently ignore nonfatal error
    console.warn("Couldn't save thebe binder connection info to local storage", e);
  }
}

export async function getExistingServer(
  { savedSession }: BinderOptions,
  url: string
): Promise<ServerInfo | null> {
  if (!savedSession.enabled) return null;
  const storageKey = makeStorageKey(savedSession.storagePrefix, url);
  let storedInfoJSON = window.localStorage.getItem(storageKey);
  if (storedInfoJSON == null) {
    console.debug('thebe:getExistingServer No session saved in ', storageKey);
    return null;
  }

  console.debug('thebe:getExistingServer Saved binder session detected');
  let existingServer = JSON.parse(storedInfoJSON ?? '');
  let lastUsed = new Date(existingServer.lastUsed);
  const now = new Date();
  let ageSeconds = (now.getTime() - lastUsed.getTime()) / 1000;
  if (ageSeconds > savedSession.maxAge) {
    console.debug(
      `thebe:getExistingServer Not using expired binder session for ${existingServer.url} from ${lastUsed}`
    );
    window.localStorage.removeItem(storageKey);
    return null;
  }

  try {
    await KernelAPI.listRunning(ServerConnection.makeSettings(existingServer.settings));
  } catch (err) {
    console.debug(
      'thebe:getExistingServer Saved binder connection appears to be invalid, requesting new session',
      err
    );
    window.localStorage.removeItem(storageKey);
    return null;
  }

  // refresh lastUsed timestamp in stored info
  updateLastUsedTimestamp(savedSession, existingServer.id);
  console.debug(
    `thebe:getExistingServer Saved binder session is valid, reusing connection to ${existingServer.url}`
  );

  return existingServer;
}
