const path = require("path");

describe("Initialization check", () => {
  beforeAll(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto(
      `file:${path.join(__dirname, "/fixtures/HTML/bqplot.html")}`,
      { waitUntil: ["load", "domcontentloaded", "networkidle0"] }
    );
  });

  test('should have the title "Bqplot example"', async () => {
    await expect(page.title()).resolves.toMatch("Bqplot example");
  });
  test("should have CodeMirror initalized", async () => {
    const text = await page.evaluate(() => document.body.innerHTML);
    // console.log(text);
    expect(text).toContain('class="thebelab-cell"');
  });
});

async function loadThebeRunButton () {
  return page.waitForSelector('button.thebelab-run-button');
}

async function clickRunButton() {
  return page.click('button.thebelab-run-button');
}

async function loadPanButton() {
  return page.waitForSelector('button.widget-toggle-button');
}

async function clickPanButton() {
  return page.click('button.widget-toggle-button');
}

describe("cells are default editable", () => {
  test("case-bqplot-pan", async () => {
    await loadThebeRunButton();
    await clickRunButton();
    await loadPanButton();
    await clickPanButton();

    page.on("pageerror", function(err) {  
      return false;
    });

    return true;
  });
});