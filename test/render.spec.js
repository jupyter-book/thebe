import * as thebe from "../src";
import { appendConfig, appendElementToBody } from "./helpers";

describe("rendering cells via bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  // TODO: consider using karma-fixture
  it("cell rendering (default)", () => {
    appendElementToBody("pre", "data-executable", null);

    const p = thebe.bootstrap(); // don't wait for kernel
    expect(p.then).to.not.be.undefined;

    const cells = document.body.getElementsByClassName("thebelab-input");
    expect(cells.length).to.equal(1);
  });
  it("cell rendering (selector)", () => {
    appendElementToBody("div", null, "mycode");

    const p = thebe.bootstrap({ selector: ".mycode" }); // don't wait for kernel
    expect(p.then).to.not.be.undefined;

    const cells = document.body.getElementsByClassName("thebelab-input");
    expect(cells.length).to.equal(1);
  });
  it("output preview rendering (default)", () => {
    // output must be preceeded by a executable cell
    appendElementToBody("pre", "data-executable", null);
    appendElementToBody("div", "data-output", null);

    const p = thebe.bootstrap(); // don't wait for kernel
    expect(p.then).to.not.be.undefined;

    const cells = document.body.getElementsByClassName("jp-OutputArea");
    expect(cells.length).to.equal(1);
  });
  it("output preview rendering (selector)", () => {
    appendElementToBody("pre", "data-executable", null);
    appendElementToBody("div", null, "mypreview");

    const p = thebe.bootstrap({ outputSelector: "div.mypreview" }); // don't wait for kernel
    expect(p.then).to.not.be.undefined;

    const cells = document.body.getElementsByClassName("jp-OutputArea");
    expect(cells.length).to.equal(1);
  });
});
