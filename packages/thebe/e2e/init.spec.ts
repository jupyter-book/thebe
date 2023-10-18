import path from 'path';

describe('Initialization check', () => {
  beforeAll(async () => {
    await page.goto(`file:${path.join(__dirname, '/fixtures/HTML/readonly1.html')}`, {
      waitUntil: ['load', 'domcontentloaded', 'networkidle0'],
    });
  });

  test('should have the title "readonly1"', async () => {
    await expect(page.title()).resolves.toMatch('readonly1');
  });
  test('should have CodeMirror initialized', async () => {
    const text = await page.evaluate(() => document.body.innerHTML);
    expect(text).toContain('thebe-cell');
  });
});
