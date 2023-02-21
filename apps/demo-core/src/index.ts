import { setupThebeCore } from 'thebe-core';
import App from './app';

document.addEventListener('DOMContentLoaded', async function () {
  console.log('Starting Demo... loading App...');
  setupThebeCore();
  (window as any).app = new App();
});
