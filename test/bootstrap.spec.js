import * as thebe from "../src";

describe("bootstrap", () => {
  it("should define events", () => {
    expect(thebe).to.have.property("events");
  });
})