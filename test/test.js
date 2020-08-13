import * as thebe from "../src";

import { expect } from "chai";

describe("thebe", () => {
  it("should define events", () => {
    expect(thebe).to.have.property("events");
  });
});
