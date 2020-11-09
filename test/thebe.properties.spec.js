import * as thebe from "../src";

describe("properties", () => {
  it("thebelab  is on window", () => {
    expect(window.thebelab).toBeDefined()
  });
  it("should define events", () => {
    expect(thebe).toHaveProperty("events");
  });
});
