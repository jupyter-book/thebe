import * as thebelab from "./thebelab.js";
export * from "./thebelab.js";

if (typeof window !== "undefined") {
  window.thebelab = thebelab;
  if (thebelab.getOption("bootstrap")) {
    thebelab.bootstrap();
  }
}
