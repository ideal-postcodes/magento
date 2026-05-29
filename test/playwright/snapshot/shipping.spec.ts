import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, runPostcodeLookupSuite, Suite } from "../support/suite";
import { selectors } from "../../../lib/billing";

const address = fixtures.jersey;

const suite: Suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

test.describe("Customer", () => {
  test.describe("Checkout - Shipping form", () => {
    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/checkout/shipping.html", true);
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });

    test("Postcode Lookup", async ({ page, shadowDom }) => {
      await runPostcodeLookupSuite(page, suite, shadowDom);
    });
  });
});
