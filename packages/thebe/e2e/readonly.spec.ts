import path from 'path';

function checkReadOnly(id: string) {
  const el = document.getElementById(id);
  if (!el) {
    throw new Error(`Element not found ${id}`);
  }
  return el.getAttribute('data-readonly') != null;
}

describe('cells are default editable', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly1.html')}`, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    });
  });
  test('case-noconfig', async () => {
    const isReadOnly = await page.evaluate<(selector: string) => boolean>(
      checkReadOnly,
      'case-noconfig',
    );
    expect(isReadOnly).toEqual(false);
  });
  test('case-standalone', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-standalone');
    expect(isReadOnly).toEqual(true);
  });
  test('case-empty', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-empty');
    expect(isReadOnly).toEqual(true);
  });
  test('case-true', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-true');
    expect(isReadOnly).toEqual(true);
  });
  test('case-false', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-false');
    expect(isReadOnly).toEqual(false);
  });
  test('case-nonexistent', async () => {
    await expect(page.evaluate(checkReadOnly, 'nonexistent')).rejects.toThrowError(
      'Evaluation failed: Error: Element not found nonexistent',
    );
  });
});

describe('cells are default readonly', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly2.html')}`, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    });
  });

  test('case-noconfig', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-noconfig');
    expect(isReadOnly).toEqual(true);
  });
  test('case-standalone', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-standalone');
    expect(isReadOnly).toEqual(true);
  });
  test('case-empty', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-empty');
    expect(isReadOnly).toEqual(true);
  });
  test('case-true', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-true');
    expect(isReadOnly).toEqual(true);
  });
  test('case-false', async () => {
    const isReadOnly = await page.evaluate(checkReadOnly, 'case-false');
    expect(isReadOnly).toEqual(false);
  });
  test('case-nonexistent', async () => {
    await expect(page.evaluate(checkReadOnly, 'nonexistent')).rejects.toThrowError(
      'Evaluation failed: Error: Element not found nonexistent',
    );
  });
});
