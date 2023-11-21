'use strict';
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../../../node_modules/@types/serviceworker/index.d.ts" />
/**
 * reproduced and reduced from https://github.com/jupyterlite/jupyterlite/blob/main/packages/server/src/service-worker.ts
 * to remove caching and other features not needed for thebe
 */

/**
 * Communication channel for drive access
 */
const broadcast = new BroadcastChannel('/api/drive.v1');
/**
 * Install event listeners
 */
self.addEventListener('install', onInstall);
self.addEventListener('activate', onActivate);
self.addEventListener('fetch', onFetch);
// Event handlers
/**
 * Handle installation with the cache
 */
function onInstall(event) {
  void self.skipWaiting();
}
/**
 * Handle activation.
 */
function onActivate(event) {
  event.waitUntil(self.clients.claim());
}
/**
 * Handle fetching a single resource.
 */
async function onFetch(event) {
  const { request } = event;
  const url = new URL(event.request.url);
  let responsePromise = null;
  if (shouldBroadcast(url)) {
    responsePromise = broadcastOne(request);
  } else if (!shouldDrop(request, url)) {
    // responsePromise = maybeFromCache(event);
    const { request } = event;
    responsePromise = await fetch(request);
  }
  if (responsePromise) {
    event.respondWith(responsePromise);
  }
}

/**
 * Whether a given URL should be broadcast
 */
function shouldBroadcast(url) {
  return url.origin === location.origin && url.pathname.includes('/api/drive');
}
/**
 * Whether the fallback behavior should be used
 */
function shouldDrop(request, url) {
  return (
    request.method !== 'GET' || url.origin.match(/^http/) === null || url.pathname.includes('/api/')
  );
}
/**
 * Forward request to main using the broadcast channel
 */
async function broadcastOne(request) {
  const promise = new Promise((resolve) => {
    broadcast.onmessage = (event) => {
      resolve(new Response(JSON.stringify(event.data)));
    };
  });
  const message = await request.json();
  // Mark message as being for broadcast.ts
  // This makes sure we won't get problems with messages
  // across tabs with multiple notebook tabs open
  message.receiver = 'broadcast.ts';
  broadcast.postMessage(message);
  return await promise;
}

//# sourceMappingURL=service-worker.js.map
