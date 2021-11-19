import * as thebe from "../src";

describe("properties", () => {
  it("thebe  is on window", () => {
    expect(window.thebe).toBeDefined();
    expect(window.thebelab).toBeDefined();
  });
  it("should define events", () => {
    expect(thebe).toHaveProperty("events");
  });
});
