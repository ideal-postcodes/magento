/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
  autocompleteSuite,
  postcodeLookupSuite,
} from "../support/suite";
import { selectors } from "../../../../lib/billing";

const address = fixtures.jersey;

const suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

describe("Customer", () => {
  describe("Checkout - Shipping form", () => {
    before(() => {
      cy.setup("./fixtures/checkout/shipping.html", true);
    });

    setupSuite(suite);
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
