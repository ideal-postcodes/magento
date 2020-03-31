describe("My First Test", function() {
  it("Does not do much!", function() {
    cy.visit("/admin");
    expect(true).to.equal(true);
  });
});
