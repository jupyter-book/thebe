import { KernelAPI, ServerConnection } from '@jupyterlab/services';
import type { SavedSessionInfo, SavedSessionOptions, ServerSettings } from './types';

export function removeServerInfo(storageKey: string) {
  window.localStorage.removeItem(storageKey);
}

export function updateLastUsedTimestamp(storageKey: string) {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return;
  const obj = JSON.parse(saved);
  window.localStorage.setItem(storageKey, JSON.stringify({ ...obj, lastUsed: new Date() }));
}

export function saveServerInfo(
  storageKey: string,
  id: string,
  serverSettings: Required<ServerSettings>,
) {
  try {
    // save the current connection url+token to reuse later
    const { baseUrl, token, wsUrl } = serverSettings;
    window.localStorage.setItem(
      storageKey,
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
  storageKey: string,
): Promise<SavedSessionInfo | null> {
  if (!savedSessionOptions.enabled) return null;
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
  updateLastUsedTimestamp(storageKey);
  console.debug(
    `thebe:getExistingServer Saved binder session is valid and will be reused ${existingSettings.baseUrl}`,
  );

  return existingSettings;
}

/**
 * Remove all saved sessions items from local storage based on the storagePrefix provided.
 * The appropriate (default) storage prefix will be available in the SavedSessionOptions object
 * in the Config object.
 *
 * @param storagePrefix
 */
export function clearAllSavedSessions(storagePrefix = 'thebe-binder') {
  const keysToRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const key = window.localStorage.key(i);
    if (key?.startsWith(storagePrefix)) {
      keysToRemove.push(key);
    }
  }
  console.debug(
    `thebe:clearAllSavedSessions - removing ${keysToRemove.length} saved sessions`,
    keysToRemove.join(','),
  );
  keysToRemove.forEach((key) => window.localStorage.removeItem(key));
}

/**
 * Remove all saved sessions items from local storage based on the storagePrefix provided.
 * The appropriate (default) storage prefix will be available in the SavedSessionOptions object
 * in the Config object.
 *
 * @param storagePrefix
 * @param url
 */
export function clearSavedSession(storageKey: string) {
  console.debug(`thebe:clearSavedSession - removing ${storageKey}`);
  window.localStorage.removeItem(storageKey);
}
