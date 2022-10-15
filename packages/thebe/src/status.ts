import type { MessageCallbackArgs } from 'thebe-core';
import { MessageSubject, ServerStatus, SessionStatus } from 'thebe-core';

// Functions for the thebe activate button and status field
export class KernelStatus {
  stub: string;
  constructor() {
    this.stub = 'Status:';
    this._registerHandlers();
  }

  _registerHandlers() {
    window.thebe.on('status', (name: string, { subject, status, message }: MessageCallbackArgs) => {
      if (
        subject !== MessageSubject.server &&
        subject !== MessageSubject.session &&
        subject !== MessageSubject.kernel
      )
        return;
      const field = this._fieldElement();
      if (field) {
        switch (status) {
          case ServerStatus.launching:
            field.className = `thebe-status-field thebe-status-${status}`;
            field.textContent = 'Launching...';
            break;
          case ServerStatus.failed:
            field.className = `thebe-status-field thebe-status-${status}`;
            field.textContent = 'Failed to connect to server';
            break;
          case ServerStatus.closed:
            field.className = `thebe-status-field thebe-status-${status}`;
            field.textContent = 'Server connection closed';
            break;
          case SessionStatus.shutdown:
            field.className = `thebe-status-field thebe-status-${status}`;
            field.textContent = 'Session is dead';
            break;
          case SessionStatus.starting:
            field.className = `thebe-status-field thebe-status-${status}`;
            field.textContent = 'Starting session';
            break;
          case SessionStatus.ready:
            field.className = `thebe-status-field thebe-status-ready`;
            field.textContent = 'Kernel Connected';
            break;
          case ServerStatus.ready:
            field.className = `thebe-status-field thebe-status-ready`;
            field.textContent = 'Conected to Server';
            break;
        }
      }

      const msg = this._messageElement();
      if (msg) msg.textContent = message;
    });
  }

  _messageElement() {
    const collection = document.getElementsByClassName('thebe-status-message');
    return collection.length ? collection.item(0) : undefined;
  }

  _fieldElement() {
    const collection = document.getElementsByClassName('thebe-status-field');
    return collection.length ? collection.item(0) : undefined;
  }

  /**
   * Mount the status field widget.
   *
   * Contents of the element with class `thebe-status-field` will be replaced with a status widget
   *
   * @returns true if an element with the expected class was found
   */
  mount() {
    const el = document.querySelector('.thebe-status');
    if (!el) {
      console.log('KernelStatus mount requested but no .thebe-status element found on page');
      return;
    }

    const box = document.createElement('div');
    box.className = 'thebe-status thebe-status-mounted';
    box.setAttribute('title', this.stub);

    const stub = document.createElement('span');
    stub.classList.add('thebe-status-stub');
    stub.textContent = this.stub;
    box.appendChild(stub);

    const field = document.createElement('span');
    field.classList.add('thebe-status-field');
    field.textContent = 'No Kernel Attached';

    const message = document.createElement('div');
    message.classList.add('thebe-status-message');

    box.append(stub, field, message);

    el.replaceWith(box);

    return el !== undefined;
  }

  unmount() {
    const el = document.querySelector('.thebe-status');
    if (!el) return;
    let child = el.lastElementChild;
    while (child) {
      el.removeChild(child);
      child = el.lastElementChild;
    }
    return el;
  }
}
