import $ from "jquery";

// Functions for the thebe activate button and status field
export class KernelStatus {
  constructor(thebe) {
    this.status_stub = "Status:";
    this.status_no_kernel = "No Kernel Attached";
    this._registerHandlers(thebe);
  }

  _registerHandlers(thebe) {
    const widget = this;
    thebe.on("status", function (evt, data) {
      $(".thebe-status .thebe-status-field")
        .attr("class", "thebe-status-field thebe-status-" + data.status)
        .text(data.status);
      $(".thebe-status .thebe-status-message")
        .attr("style", "margin-top:4px")
        .text(data.message);
    });
  }

  /**
   * Mount the status field widget.
   *
   * Contents of the element with class `thebe-status-field` will be replaced with a status widget
   *
   * @returns true if an element with the expected class was found
   */
  mount() {
    const el = $(".thebe-status");
    el.replaceWith(
      `<div class="thebe-status"
        title="${this.status_stub}">
        <span class="thebe-status-stub">${this.status_stub}</span>
        <span class="thebe-status-field">
          ${this.status_no_kernel}
        </span>
        <div class="thebe-status-message"></div>
      </div>`
    );
    if (!el)
      console.log(
        "KernelStatus mount requested but no .thebe-status element found on page"
      );
    return el !== undefined;
  }

  unmount() {
    const el = $(".thebe-status");
    el.empty();
    return el;
  }
}
