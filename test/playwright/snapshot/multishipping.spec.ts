import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, runPostcodeLookupSuite, Suite } from "../support/suite";
import { selectors } from "../../../lib/multishipping";

const address = fixtures.jersey;

test.describe("Multishipping", () => {
  test.describe("Create New Customer Account", () => {
    const suite: Suite = {
      scope: ".form.create.account.form-create-account",
      selectors,
      address,
    };

    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/multishipping/checkout-register.html", true);
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });

    test("Postcode Lookup", async ({ page, shadowDom }) => {
      await runPostcodeLookupSuite(page, suite, shadowDom);
    });
  });

  test.describe("Create Shipping Address", () => {
    const suite: Suite = {
      scope: ".form-address-edit",
      selectors,
      address,
    };

    test.beforeEach(async ({ setupPage }) => {
      await setupPage(
        "/test/snapshot/fixtures/multishipping/checkoutaddress-newshipping.html",
        true
      );
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });

    test("Postcode Lookup", async ({ page, shadowDom }) => {
      await runPostcodeLookupSuite(page, suite, shadowDom);
    });
  });
});
