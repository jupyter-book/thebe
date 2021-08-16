import * as thebelab from "./thebelab";
export * from "./thebelab";
export * from "./utils";
import $ from "jquery";

if (typeof window !== "undefined") {
  window.thebelab = thebelab;
  window.thebelab.$ = $;
  const options = thebelab.mergeOptions();
  if (options["mountStatusWidget"]) {
    document.addEventListener("DOMContentLoaded", () => {
      thebelab.mountStatusWidget();
    });
  }
  if (options["bootstrap"]) {
    document.addEventListener("DOMContentLoaded", () => {
      thebelab.bootstrap();
    });
  }
}
