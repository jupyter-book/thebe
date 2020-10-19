import * as thebe from '../src';

describe("properties", () => {
  it("thebelab  is on window", () => {
    expect(window.thebelab).to.not.be.undefined;
  })
  it("should define events", () => {
    expect(thebe).to.have.property("events");
  });
})
