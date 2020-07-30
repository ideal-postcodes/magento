/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
  autocompleteSuite,
  postcodeLookupSuite,
} from "../support/suite";
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
    before(() => {
      cy.setup("./fixtures/checkout/onepagecheckout-demo.html", true);
    });
    describe("Shipping", () => {
      setupSuite(suiteShipping);
      autocompleteSuite(suiteShipping);
      postcodeLookupSuite(suiteShipping);
    });
    describe("Billing", () => {
      setupSuite(suiteBilling);
      autocompleteSuite(suiteBilling);
      postcodeLookupSuite(suiteBilling);
    });
  });
  describe("Express Checkout Lane", () => {
    before(() => {
      cy.setup("./fixtures/checkout/onestepcheckoutcom-checkout.html", true);
    });

    setupSuite(suiteShippingCom);
    autocompleteSuite(suiteShippingCom);
    postcodeLookupSuite(suiteShippingCom);
  });
});
