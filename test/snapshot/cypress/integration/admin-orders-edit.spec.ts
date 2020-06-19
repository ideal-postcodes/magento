/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { setupSuite, autocompleteSuite } from "../support/suite";
import { selectors } from "../../../../lib/admin-orders-edit";

const address = fixtures.jersey;

describe("Admin", () => {
  describe("Orders Edit", () => {
    const suite = {
      scope: "#edit_form",
      selectors,
      address
    };
    before(() => {
      cy.setup("./fixtures/admin/sales/order/edit.html");
    });
    setupSuite(suite, true);
    autocompleteSuite(suite);
  });

  describe("Customer Edit", () => {
    before(() => {
      cy.setup("./fixtures/admin/customer/edit.html");
    });
    const suite = {
      scope:
        ".customer_form_areas_address_address_customer_address_update_modal_update_customer_address_form_loader",
      selectors,
      address
    };
    setupSuite(suite);
    autocompleteSuite(suite);
  });
});
