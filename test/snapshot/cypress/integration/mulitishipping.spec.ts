/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
  autocompleteSuite,
  postcodeLookupSuite
} from "../support/suite";
import { selectors } from "../../../../lib/multishipping";
const address = fixtures.jersey;

describe("Multishipping", () => {
  describe("Create New Customer Account", () => {
    const suite = {
      scope: ".form-create-account",
      selectors,
      address
    };
    before(() => {
      cy.setup("./fixtures/multishipping/checkout-register.html", true);
    });

    setupSuite(suite, true);
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });

  describe("Create Shipping Address", () => {
    const suite = {
      scope: ".form-address-edit",
      selectors,
      address
    };

    before(() => {
      cy.setup(
        "./fixtures/multishipping/checkoutaddress-newshipping.html",
        true
      );
    });

    setupSuite(suite, true);
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
