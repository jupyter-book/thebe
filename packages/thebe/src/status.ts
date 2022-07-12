// Functions for the thebe activate button and status field
export class KernelStatus {
  stub: string;
  constructor() {
    this.stub = 'Status:';
    this._registerHandlers();
  }

  _registerHandlers() {
    // window.thebe.on('status', function (name: string, data: any) {
    //   // $('.thebe-status .thebe-status-field')
    //   //   .attr('class', 'thebe-status-field thebe-status-' + data.status)
    //   //   .text(data.status);
    //   // $('.thebe-status .thebe-status-message').attr('style', 'margin-top:4px').text(data.message);
    // });
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
    box.classList.add('thebe-status","thebe-status-mounted');
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
