/// <reference types="cypress" />;
Cypress.on("uncaught:exception", (err) => {
  console.log(err);
  return false;
});

import { selectors } from "../../../../lib/billing";

describe("Country Sync", () => {
  before(() => {
    cy.visit("/admin");
    cy.get("#username").type("admin");
    cy.get("#login").type("foobar21");
    cy.get("form").contains("Sign in").click();
    cy.visit(
      "/index.php/admin/admin/system_config/edit/section/idealpostcodes"
    );
    cy.get("#idealpostcodes_admin_autocomplete_override").clear();
    cy.get(
      "#idealpostcodes_admin_autocomplete_override"
    ).type('{"syncCountrySelect": true}', { parseSpecialCharSequences: false });
    cy.get("#save").click();
    // Add product and visit checkout
    cy.visit("/index.php/simple-product-113.html");
    cy.get("#product-addtocart-button").click();
    cy.get(".message-success > div").should(
      "contain.text",
      "You added Simple Product 113"
    );
    cy.visit("/index.php/checkout/");
    cy.wait(5000);
  });

  it("Country is sync when change in address finder", () => {
    cy.get(selectors.line_1).focus().type("1").clear();
    cy.wait(1000);
    cy.get(".idpc_country").first().click();
    cy.get(".idpc_ul").contains("United Kingdom").click();
    cy.get(selectors.country).should("have.value", "GB");
  });
});
