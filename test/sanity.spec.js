describe("sanity", () => {
  it("using chai assertions", () => {
    expect(true).to.be.true;
  })
  it('has chai spies', () => {
    expect(chai.spy).to.not.be.undefined;
  })
});
