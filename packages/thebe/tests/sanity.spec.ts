describe('check test environment', () => {
  test('adds 1 + 2 to equal 3', () => {
    function sum(a: number, b: number) {
      return a + b;
    }
    expect(sum(1, 2)).toBe(3);
  });
});
