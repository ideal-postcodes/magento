/// <reference types="cypress" />

import { Config } from "@ideal-postcodes/jsutil";
import { address as fixtures } from "@ideal-postcodes/api-fixtures";
const address = fixtures.jersey;

declare global {
  interface Window {
    idpcConfig: Partial<Config>;
  }
}

describe("Customer address form", () => {
  before(() => {
    cy.visit("./fixtures/customer-checkout-billing.html", {
      onBeforeLoad: window => {
        window.idpcConfig = {
          apiKey: Cypress.env("API_KEY"),
          populateOrganisation: true,
          populateCounty: true,
          autocomplete: true,
          postcodeLookup: true,
          autocompleteOverride: {
            checkKey: false
          },
          postcodeLookupOverride: {
            checkKey: false
          }
        };
      },
      onLoad: window => {
        const document = window.document;
        const script = document.createElement("script");
        script.setAttribute("type", "text/javascript");
        script.setAttribute(
          "src",
          "http://localhost:60154/test/snapshot/fixtures/binding.js"
        );
        document.head.appendChild(script);
      }
    });
  });

  describe("setup", () => {
    it("hoists country field");
  });

  describe("autocomplete", () => {
    it("enables address search on line 1");
    it("hides if unsupported country selected");
  });

  describe("postcode lookup", () => {
    it("enables postcode lookup");
    it("hides if unsupported country selected");
  });
});
