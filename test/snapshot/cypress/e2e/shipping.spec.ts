/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { autocompleteSuite, postcodeLookupSuite } from "../support/suite";
import { selectors } from "../../../../lib/billing";

const address = fixtures.jersey;

const suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

describe("Customer", () => {
  describe("Checkout - Shipping form", () => {
    beforeEach(() => {
      cy.setup("/test/snapshot/fixtures/checkout/shipping.html", true);
    });
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
