/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { autocompleteSuite, postcodeLookupSuite } from "../support/suite";
import { selectors } from "../../../../lib/multishipping";
const address = fixtures.jersey;

describe("Multishipping", () => {
  describe("Create New Customer Account", () => {
    const suite = {
      scope: ".form.create.account.form-create-account",
      selectors,
      address,
    };
    beforeEach(() => {
      cy.setup("./fixtures/multishipping/checkout-register.html", true);
    });
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });

  describe("Create Shipping Address", () => {
    const suite = {
      scope: ".form-address-edit",
      selectors,
      address,
    };

    beforeEach(() => {
      cy.setup(
        "./fixtures/multishipping/checkoutaddress-newshipping.html",
        true
      );
    });
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
