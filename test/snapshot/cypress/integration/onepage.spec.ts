/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { autocompleteSuite, postcodeLookupSuite } from "../support/suite";
import { selectors } from "../../../../lib/billing";

const address = fixtures.jersey;

const suiteShipping = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

const suiteBilling = {
  scope: ".checkout-billing-address",
  selectors,
  address,
};

const suiteShippingCom = {
  scope: ".form-shipping-address",
  selectors,
  address,
};

describe("One Page Checkout", () => {
  describe("Demo checkout", () => {
    beforeEach(() => {
      cy.setup("./fixtures/checkout/onepagecheckout-demo.html", true);
    });
    describe("Shipping", () => {
      autocompleteSuite(suiteShipping);
      postcodeLookupSuite(suiteShipping);
    });
    describe("Billing", () => {
      autocompleteSuite(suiteBilling);
      postcodeLookupSuite(suiteBilling);
    });
  });
  describe("Express Checkout Lane", () => {
    beforeEach(() => {
      cy.setup("./fixtures/checkout/onestepcheckoutcom-checkout.html", true);
    });
    autocompleteSuite(suiteShippingCom);
    postcodeLookupSuite(suiteShippingCom);
  });
});
