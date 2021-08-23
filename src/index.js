import * as thebelab from "./thebelab";
export * from "./thebelab";
export * from "./utils";

if (typeof window !== "undefined") {
  window.thebelab = thebelab;
  if (thebelab.getOption("bootstrap")) {
    document.addEventListener("DOMContentLoaded", () => {
      thebelab.bootstrap();
    });
  }
}
