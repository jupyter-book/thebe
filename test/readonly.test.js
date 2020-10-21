const path = require('path');

describe('Initialization check', () => {
  beforeAll(async () => {
    // page.on('console', msg => console.log('PAGE LOG:', msg.text()));
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly1.html')}`,
      {waitUntil: ["load", "domcontentloaded", 'networkidle0']});
  });

  test('should have the title "readonly1"', async () => {
    await expect(page.title()).resolves.toMatch('readonly1');
  });
  test('should have CodeMirror initalized', async () => {
    const text = await page.evaluate(() => document.body.innerHTML);
    // console.log(text);
    expect(text).toContain('class="thebelab-cell"');
  });
});

function checkReadOnly(selector) {
  let items = $(selector);
  if (!items.length) {
    throw new Error(`Invalid selector ${selector}`);
  }
  console.log(items.attr('data-readonly'))
  return items.attr('data-readonly') !== undefined;
}

describe('cells are default editable', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly1.html')}`,
      {waitUntil: ["load", "domcontentloaded", 'networkidle0']});
  });

  test('case-base-1', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-1');
    expect(isReadOnly).toEqual(false);
  });
  test('case-base-2', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-2');
    expect(isReadOnly).toEqual(false);
  });
  test('case-base-3', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-3');
    expect(isReadOnly).toEqual(false);
  });
  test('case-standalone', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-standalone');
    expect(isReadOnly).toEqual(true);
  });
  test('case-empty', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-empty');
    expect(isReadOnly).toEqual(true);
  });
  test('case-true', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-true');
    expect(isReadOnly).toEqual(true);
  });
  test('case-false', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-false');
    expect(isReadOnly).toEqual(false);
  });
  test('case-nonexistent', async () => {
    await expect(page.evaluate(checkReadOnly, '#nonexistent')).rejects.toThrowError('Invalid selector #nonexistent');
  });
});

describe('cells are default readonly', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly2.html')}`,
      {waitUntil: ["load", "domcontentloaded", 'networkidle0']});
  });

  test('case-base-1', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-1');
    expect(isReadOnly).toEqual(true);
  });
  test('case-base-2', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-2');
    expect(isReadOnly).toEqual(true);
  });
  test('case-base-3', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-base-3');
    expect(isReadOnly).toEqual(true);
  });
  test('case-standalone', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-standalone');
    expect(isReadOnly).toEqual(true);
  });
  test('case-empty', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-empty');
    expect(isReadOnly).toEqual(true);
  });
  test('case-true', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-true');
    expect(isReadOnly).toEqual(true);
  });
  test('case-false', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, '#case-false');
    expect(isReadOnly).toEqual(false);
  });
  test('case-nonexistent', async () => {
    await expect(page.evaluate(checkReadOnly, '#nonexistent')).rejects.toThrowError('Invalid selector #nonexistent');
  });
});

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}