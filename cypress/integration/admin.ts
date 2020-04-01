/// <reference types="cypress" />;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

describe("Admin", () => {
  after(() => {
    cy.visit("/index.php/admin/admin/auth/logout/");
  });

  const apiKey = Cypress.env("API_KEY");

  it("Can navigate to config page", () => {
    // Login to admin page
    cy.visit("/admin");
    cy.get("#username").type("admin");
    cy.get("#login").type("foobar21");
    cy.get("form")
      .contains("Sign in")
      .click();
    cy.url().should("include", "/index.php/admin/admin/dashboard");
    cy.visit(
      "/index.php/admin/admin/system_config/edit/section/idealpostcodes"
    );
    cy.url().should(
      "include",
      "/index.php/admin/admin/system_config/edit/section/idealpostcodes"
    );
    cy.get("#idealpostcodes_required-head").click();
    cy.get("#idealpostcodes_required_api_key")
      .clear()
      .type(apiKey);

    cy.contains("Save Config").click();
    cy.get('div[data-ui-id="messages-message-success"]').should($div => {
      expect($div.text(), "ID").to.equal("You saved the configuration.");
    });
  });
});
