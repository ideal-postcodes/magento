import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, Suite } from "../support/suite";
import { billing, shipping } from "../../../lib/admin-orders";

const address = fixtures.jersey;

test.describe("Admin", () => {
  test.describe("New Order Customer Address", () => {
    test.describe("Billing", () => {
      const suite: Suite = {
        scope: "#order-billing_address",
        selectors: billing,
        address,
      };

      test.beforeEach(async ({ setupPage }) => {
        await setupPage("/test/snapshot/fixtures/admin/sales/customer-2.html");
      });

      test("Autocomplete", async ({ page }) => {
        await runAutocompleteSuite(page, suite);
      });
    });

    test.describe("Shipping", () => {
      const suite: Suite = {
        scope: "#order-shipping_address",
        selectors: shipping,
        address,
      };

      test.beforeEach(async ({ setupPage }) => {
        await setupPage("/test/snapshot/fixtures/admin/sales/customer-2.html");
      });

      test("Autocomplete", async ({ page }) => {
        await runAutocompleteSuite(page, suite);
      });
    });
  });

  test.describe("New Order Customer Address (shipping same as billing)", () => {
    const suite: Suite = {
      scope: "#order-billing_address",
      selectors: billing,
      address,
    };

    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/admin/sales/new-customer.html");
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });
  });
});
