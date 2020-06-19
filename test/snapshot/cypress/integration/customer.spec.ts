/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import {
  setupSuite,
  autocompleteSuite,
  postcodeLookupSuite
} from "../support/suite";
import { selectors } from "../../../../lib/multishipping";

const address = fixtures.jersey;

const suite = {
  scope: ".form-address-edit",
  selectors,
  address
};

describe("Customer", () => {
  describe("Account - New address", () => {
    before(() => {
      cy.setup("./fixtures/customer/address-form.html", true);
    });
    setupSuite(suite);
    autocompleteSuite(suite);
    postcodeLookupSuite(suite);
  });
});
