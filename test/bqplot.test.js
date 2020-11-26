const path = require("path");

async function loadThebeRunButton() {
  return page.waitForSelector("button.thebelab-run-button");
}

async function clickRunButton() {
  return page.click("button.thebelab-run-button");
}

async function loadPanButton() {
  return page.waitForSelector("button.widget-toggle-button");
}

async function clickPanButton() {
  return page.click("button.widget-toggle-button");
}

async function editBQPlot() {
  await loadThebeRunButton();
  await clickRunButton();
  await loadPanButton();
  await clickPanButton();

  return true;
}

describe("Test bqplot", () => {
  beforeAll(async () => {
    await page.goto(
      `file:${path.join(__dirname, "/fixtures/HTML/bqplot.html")}`,
      { waitUntil: ["load", "domcontentloaded", "networkidle0"] }
    );
  });

  it('should have the title "Bqplot example"', async () => {
    await expect(page.title()).resolves.toMatch("Bqplot example");
  });

  it("should have CodeMirror initalized", async () => {
    const thebeCell = page.$(".thebe-cell");
    expect(thebeCell).not.toBeNull();
  });

  describe("cells are default editable", () => {
    it("case-bqplot-pan", async () => {
      await expect(editBQPlot()).resolves.toBeTruthy();
    }, 10000000);
  });
});
