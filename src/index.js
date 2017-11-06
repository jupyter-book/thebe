import * as thebelab from "./thebelab.js";
export * from "./thebelab.js";

if (typeof window !== "undefined") {
  window.thebelab = thebelab;
  if (thebelab.getOption("bootstrap")) {
    document.addEventListener("DOMContentLoaded", () => {
      thebelab.bootstrap();
    });
  }
}
