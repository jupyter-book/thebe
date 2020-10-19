import chai, { expect } from "chai";
import spies from 'chai-spies';
chai.use(spies);
global.chai = chai;
global.expect = expect;

describe("thebe", () => {
  require("./sanity.spec");
  require("./thebe.properties.spec");
  require("./bootstrap.spec");
  require("./render.spec");
});
