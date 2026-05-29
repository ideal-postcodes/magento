import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, runPostcodeLookupSuite, Suite } from "../support/suite";
import { selectors } from "../../../lib/billing";

const address = fixtures.jersey;

const suiteShipping: Suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

const suiteBilling: Suite = {
  scope: ".checkout-billing-address",
  selectors,
  address,
};

const suiteShippingCom: Suite = {
  scope: ".form-shipping-address",
  selectors,
  address,
};

test.describe("One Page Checkout", () => {
  test.describe("Demo checkout", () => {
    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/checkout/onepagecheckout-demo.html", true);
    });

    test.describe("Shipping", () => {
      test("Autocomplete", async ({ page }) => {
        await runAutocompleteSuite(page, suiteShipping);
      });

      test("Postcode Lookup", async ({ page, shadowDom }) => {
        await runPostcodeLookupSuite(page, suiteShipping, shadowDom);
      });
    });

    test.describe("Billing", () => {
      test("Autocomplete", async ({ page }) => {
        await runAutocompleteSuite(page, suiteBilling);
      });

      test("Postcode Lookup", async ({ page, shadowDom }) => {
        await runPostcodeLookupSuite(page, suiteBilling, shadowDom);
      });
    });
  });

  test.describe("Express Checkout Lane", () => {
    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/checkout/onestepcheckoutcom-checkout.html", true);
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suiteShippingCom);
    });

    test("Postcode Lookup", async ({ page, shadowDom }) => {
      await runPostcodeLookupSuite(page, suiteShippingCom, shadowDom);
    });
  });
});
