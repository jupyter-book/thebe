import * as thebe from "../src/thebe";

/**
 * Test the bootstrapping process
 */
describe("bootstrap", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });
  it("calls pre-render hook", () => {
    const spy = jest.fn();
    thebe.bootstrap({ preRenderHook: spy }); // don't wait for kernel
    expect(spy).toHaveBeenCalledTimes(1);
  });
  it.skip("calls strip prompts, when specified in options", () => {
    const spy = jest.spyOn(thebelab, "stripPrompts");

    thebe.bootstrap();
    expect(thebe.stripPrompts).not.toHaveBeenCalled();

    thebe.bootstrap({ stripPrompts: true });
    expect(thebe.stripPrompts).toHaveBeenCalled(1);

    spy.mockRestore();
  });
});
