import $ from "jquery";

export class ActivateWidget {
  constructor() {
    this.title = "Activate";
  }

  mount() {
    const el = $(".thebe-activate");
    el.replaceWith(`<div class="thebe-activate">
      <button type="button" class="thebe-activate-button" onclick="thebe.bootstrap()">${this.title}</button>
    </div>`);
  }
}
