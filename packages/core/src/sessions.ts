import { KernelAPI, ServerConnection } from '@jupyterlab/services';
import type { SavedSessionInfo, SavedSessionOptions, ServerSettings } from './types';

export function makeStorageKey(storagePrefix: string, url: string) {
  return storagePrefix + url;
}

export function removeServerInfo(savedSession: Required<SavedSessionOptions>, url: string) {
  window.localStorage.removeItem(makeStorageKey(savedSession.storagePrefix, url));
}

export function updateLastUsedTimestamp(savedSession: Required<SavedSessionOptions>, url: string) {
  const storageKey = makeStorageKey(savedSession.storagePrefix, url);
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return;
  const obj = JSON.parse(saved);
  window.localStorage.setItem(storageKey, JSON.stringify({ ...obj, lastUsed: new Date() }));
}

export function saveServerInfo(
  savedSession: Required<SavedSessionOptions>,
  url: string,
  id: string,
  serverSettings: Required<ServerSettings>,
) {
  try {
    // save the current connection url+token to reuse later
    const { baseUrl, token, wsUrl } = serverSettings;
    window.localStorage.setItem(
      makeStorageKey(savedSession.storagePrefix, url),
      JSON.stringify({
        id,
        baseUrl,
        token,
        wsUrl,
        lastUsed: new Date(),
      }),
    );
  } catch (e) {
    // storage quota full, gently ignore nonfatal error
    console.warn("Couldn't save thebe binder connection info to local storage", e);
  }
}

export async function getExistingServer(
  savedSessionOptions: Required<SavedSessionOptions>,
  url: string,
): Promise<SavedSessionInfo | null> {
  if (!savedSessionOptions.enabled) return null;
  const storageKey = makeStorageKey(savedSessionOptions.storagePrefix, url);
  const storedInfoJSON = window.localStorage.getItem(storageKey);
  if (storedInfoJSON == null) {
    console.debug('thebe:getExistingServer No session saved in ', storageKey);
    return null;
  }

  console.debug('thebe:getExistingServer Saved binder session found');
  const existingSettings = JSON.parse(storedInfoJSON ?? '') as SavedSessionInfo;
  const lastUsed = new Date(existingSettings.lastUsed);
  const now = new Date();
  const ageSeconds = (now.getTime() - lastUsed.getTime()) / 1000;
  if (ageSeconds > savedSessionOptions.maxAge) {
    console.debug(
      `thebe:getExistingServer Not using expired binder session for ${existingSettings.baseUrl} from ${lastUsed}`,
    );
    window.localStorage.removeItem(storageKey);
    return null;
  }

  try {
    await KernelAPI.listRunning(ServerConnection.makeSettings(existingSettings));
  } catch (err) {
    console.debug(
      'thebe:getExistingServer Saved binder connection appears to be invalid, requesting new session',
      err,
    );
    window.localStorage.removeItem(storageKey);
    return null;
  }

  // refresh lastUsed timestamp in stored info
  updateLastUsedTimestamp(savedSessionOptions, existingSettings.baseUrl);
  console.debug(
    `thebe:getExistingServer Saved binder session is valid and will be reused ${existingSettings.baseUrl}`,
  );

  return existingSettings;
}
