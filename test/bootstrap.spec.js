// import * as thebe from "../src";

describe("bootstrap", () => {
  // TODO: consider using karma-fixture
  beforeEach(() => {
    // stop automatic bootstrap
    // `<script type="text/x-thebe-config">
    // {
    //   bootstrap: false
    // }
    // </script>
    // `
  })
  it("should define events", async () => {
    const thebe = await import("../src");
    expect(thebe).to.have.property("events");
  });
})