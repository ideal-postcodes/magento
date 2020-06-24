/// <reference types="cypress" />;

Cypress.on("uncaught:exception", (err, runnable) => {
  console.log(err);
  return false;
});

import { address as addresses } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
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
    cy.contains("Add to Cart").click();
    cy.get(".message-success > div").should(
      "contain.text",
      "You added Simple Product 113"
    );
    cy.visit("/index.php/checkout/");
  });

  setupSuite(suite, true);
  postcodeLookupSuite(suite);
  autocompleteSuite(suite);
});
