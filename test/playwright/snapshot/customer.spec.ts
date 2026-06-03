import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, runPostcodeLookupSuite, Suite } from "../support/suite";
import { selectors } from "../../../lib/multishipping";

const address = fixtures.jersey;

const suite: Suite = {
  scope: ".form-address-edit",
  selectors,
  address,
};

test.describe("Customer", () => {
  test.describe("Account - New address", () => {
    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/customer/address-form.html", true);
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });

    test("Postcode Lookup", async ({ page, shadowDom }) => {
      await runPostcodeLookupSuite(page, suite, shadowDom);
    });
  });
});
