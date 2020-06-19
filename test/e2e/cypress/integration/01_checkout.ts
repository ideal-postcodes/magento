/// <reference types="cypress" />;
const version = Cypress.env("MAGENTO_VERSION");

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

const waitPerVersion = (time: number) => {
  const check = ["2.3"];
  if (!check.includes(version)) cy.wait(time);
};

describe("Checkout", () => {
  before(() => {
    // Add product and visit checkout
    cy.visit("/index.php/simple-product-113.html");
    waitPerVersion(30000);
    cy.get("#product-addtocart-button").click();
    waitPerVersion(30000);
    cy.get(".message-success > div").should(
      "contain.text",
      "You added Simple Product 113"
    );
    cy.visit("/index.php/checkout/");
    waitPerVersion(10000);
  });

  postcodeLookupSuite(suite);
  autocompleteSuite(suite);
});
