import * as thebelab from "../src/thebelab";

/**
 * Test the bootstrapping process
 */
describe("bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  it("calls pre-render hook", () => {
    const spy = chai.spy();
    thebelab.bootstrap({ preRenderHook: spy }); // don't wait for kernel
    expect(spy).to.have.been.called.once;
  });
  it.skip("calls strip prompts, when specified in options", () => {
    chai.spy.on(thebelab, "stripPrompts");

    thebelab.bootstrap();
    expect(thebelab.stripPrompts).to.not.have.been.called;

    thebelab.bootstrap({ stripPrompts: true });
    expect(thebelab.stripPrompts).to.have.been.called.once;

    chai.spy.restore(thebelab);
  });
});
