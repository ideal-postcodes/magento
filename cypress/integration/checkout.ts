/// <reference types="cypress" />;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

import { address as addresses } from "@ideal-postcodes/api-fixtures";
const address = addresses.england;

describe("Checkout", () => {
  let address;

  before(() => {
    cy.visit("/index.php/simple-product-113.html");
    cy.contains("Add to Cart").click();
    cy.visit("/index.php/checkout/");
  });

  it("Should not be able to use address search", () => {
    cy.get("#idpc_input").should("not.exist");
    cy.get("#idpc_button").should("not.exist");
  });

  it("Find", () => {
    cy.get('select[name="country_id"]').select("GB");
    cy.get("#idpc_input").type(address.postcode);
    cy.get("#idpc_button").click();
    cy.get("#idpc_dropdown").select("0");
    cy.get('input[name="street[0]"]').should("have.value", address.street);
    cy.get('input[name="city"]').should("have.value", address.city);
    cy.get('input[name="postcode"]').should("have.value", address.postcode);
  });

  it("Autocomplete", () => {
    // When country is not UK, no autocomplete appears
    cy.get('input[name="street[0]"]').type(address.postcode);
    cy.get(".idpc_ul li")
      .first()
      .click();
    cy.get('input[name="city"]').should("have.value", address.city);
    cy.get('input[name="postcode"]').should("have.value", address.postcode);
  });

  describe("Billing", () => {
    before(() => {
      //fill data for pass to billing page
      cy.get('select[name="country_id"]').select("GB");
      cy.get("#idpc_input").type(address.postcode);
      cy.get("#idpc_button").click();
      cy.get("#idpc_dropdown").select("0");
      cy.get("#customer-email").type(address.email);
      cy.get('input[name="firstname"]').type(address.firstname);
      cy.get('input[name="lastname"]').type(address.lastname);
      cy.get('input[name="telephone"]').type(address.phone);
      cy.get(".button.action.continue.primary").click();
      cy.get("#billing-address-same-as-shipping-checkmo").uncheck();
    });

    it("Find", () => {
      cy.get(".billing-address-form").within(() => {
        cy.get("#idpc_input").should("not.exist");
        cy.get("#idpc_button").should("not.exist");
        //select UK
        cy.get('select[name="country_id"]').select("GB");
        cy.get("#idpc_input").type(address.postcode);
        cy.get("#idpc_button").click();
        cy.get("#idpc_dropdown").select("0");
        cy.get('input[name="street[0]"]').should("have.value", address.street);
        cy.get('input[name="city"]').should("have.value", address.city);
        cy.get('input[name="postcode"]').should("have.value", address.postcode);
      });
    });

    it("Autocomplete", () => {
      cy.get(".billing-address-form").within(() => {
        cy.get('input[name="street[0]"]').type(address.postcode);
        cy.get(".idpc_ul li")
          .first()
          .click();
        cy.get('input[name="city"]').should("have.value", address.city);
        cy.get('input[name="postcode"]').should("have.value", address.postcode);
      });
    });
  });
});
