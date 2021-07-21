import * as thebelab from "../src/thebelab";

/**
 * Test the bootstrapping process
 */
describe("bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  it("calls pre-render hook", () => {
    const spy = jest.fn();
    thebelab.bootstrap({ preRenderHook: spy }); // don't wait for kernel
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it.skip("calls strip prompts, when specified in options", () => {
    const spy = jest.spyOn(thebelab, "stripPrompts");

    thebelab.bootstrap();
    expect(thebelab.stripPrompts).not.toHaveBeenCalled();

    thebelab.bootstrap({ stripPrompts: true });
    expect(thebelab.stripPrompts).toHaveBeenCalled(1);

    spy.mockRestore();
  });
});
