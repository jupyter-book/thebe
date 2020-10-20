import { expect } from "chai";
global.expect = expect;

describe("thebe", () => {
  require("./sanity.spec");
  require("./bootstrap.spec");
  require("./readonly.spec");
});
