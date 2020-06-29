/// <reference types="cypress" />;

Cypress.on("uncaught:exception", err => {
  console.log(err);
  return false;
});

import { address as addresses } from "@ideal-postcodes/api-fixtures";
import {
  autocompleteSuite,
  postcodeLookupSuite
} from "../../../snapshot/cypress/support/suite";
import { selectors } from "../../../../lib/billing";

const address = addresses.jersey;
const suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address
};

describe("Checkout", () => {
  before(() => {
    // Add product and visit checkout
    cy.visit("/index.php/simple-product-113.html");
    cy.wait(10000);
    cy.get("#product-addtocart-button").click();
    cy.wait(2000);
    cy.get(".message-success > div").should(
      "contain.text",
      "You added Simple Product 113"
    );
    cy.visit("/index.php/checkout/");
    cy.wait(5000);
  });

  postcodeLookupSuite(suite);
  autocompleteSuite(suite);
});
