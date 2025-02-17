/// <reference types="cypress" />

import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { autocompleteSuite } from "../support/suite";
import { billing, shipping } from "../../../../lib/admin-orders";

const address = fixtures.jersey;

describe("Admin", () => {
  describe("New Order Customer Address", () => {
    describe("Billing", () => {
      before(() => {
        cy.setup("/test/snapshot/fixtures/admin/sales/customer-2.html");
      });
      const suite = {
        scope: "#order-billing_address",
        selectors: billing,
        address,
      };
      autocompleteSuite(suite);
    });

    describe("Shipping", () => {
      before(() => {
        cy.setup("/test/snapshot/fixtures/admin/sales/customer-2.html");
      });
      const suite = {
        scope: "#order-shipping_address",
        selectors: shipping,
        address,
      };
      autocompleteSuite(suite);
    });
  });

  describe("New Order Customer Address (shipping same as billing)", () => {
    const suite = {
      scope: "#order-billing_address",
      selectors: billing,
      address,
    };

    before(() => {
      cy.setup("/test/snapshot/fixtures/admin/sales/new-customer.html");
    });
    autocompleteSuite(suite);
  });
});
