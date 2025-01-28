/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { autocompleteSuite, postcodeLookupSuite } from "../support/suite";
import { selectors } from "../../../../lib/multishipping";

const address = fixtures.jersey;

const suite = {
  scope: ".form-address-edit",
  selectors,
  address,
};

describe("Customer", () => {
  describe("Account - New address", () => {
    beforeEach(() => {
      cy.setup("/test/snapshot/fixtures/customer/address-form.html", true);
    });
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
