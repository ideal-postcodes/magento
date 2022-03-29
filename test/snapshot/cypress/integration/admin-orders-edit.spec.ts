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
      address,
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
      address,
    };
    setupSuite(suite);
    autocompleteSuite(suite);
  });

  describe("Custom Fields", () => {
    const suite = {
      scope: "#order-billing_address_fields",
      selectors: {
        "line_1": "#order-billing_address_street0",
        "line_2": "#order-billing_address_street1",
        "line_3": "#order-billing_address_street2",
        "country": "#order-billing_address_country_id",
        "post_town": "#order-billing_address_city",
        "postcode": "#order-billing_address_postcode"
      },
      address,
    };
    before(() => {
      // @ts-ignore
      cy.setup("./fixtures/customer/custom-address-fields.html", false, [suite.selectors]);
    });
    setupSuite(suite, true);
    autocompleteSuite(suite);
  });
});
