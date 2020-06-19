/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
  autocompleteSuite,
  postcodeLookupSuite
} from "../support/suite";
import { selectors } from "../../../../lib/billing";

const address = fixtures.jersey;

const suite = {
  scope: ".checkout-billing-address",
  selectors,
  address
};

describe("Customer", () => {
  describe("Checkout - Billing form", () => {
    before(() => {
      cy.setup("./fixtures/checkout/billing.html", true);
    });

    setupSuite(suite);
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
