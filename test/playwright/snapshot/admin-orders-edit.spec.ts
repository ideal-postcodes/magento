import { address as fixtures } from "@ideal-postcodes/api-fixtures";
import { test, expect } from "../support/fixtures";
import { runAutocompleteSuite, Suite } from "../support/suite";
import { selectors } from "../../../lib/admin-orders-edit";

const address = fixtures.jersey;

test.describe("Admin", () => {
  test.describe("Orders Edit", () => {
    const suite: Suite = {
      scope: "#edit_form",
      selectors,
      address,
    };

    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/admin/sales/order/edit.html");
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });
  });

  test.describe("Customer Edit", () => {
    const suite: Suite = {
      scope:
        ".customer_form_areas_address_address_customer_address_update_modal_update_customer_address_form_loader",
      selectors,
      address,
    };

    test.beforeEach(async ({ setupPage }) => {
      await setupPage("/test/snapshot/fixtures/admin/customer/edit.html");
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });
  });

  test.describe("Custom Fields", () => {
    const customSelectors = {
      line_1: "#order-billing_address_street0",
      line_2: "#order-billing_address_street1",
      line_3: "#order-billing_address_street2",
      country: "#order-billing_address_country_id",
      post_town: "#order-billing_address_city",
      postcode: "#order-billing_address_postcode",
    };

    const suite: Suite = {
      scope: "#order-billing_address_fields",
      selectors: customSelectors,
      address,
    };

    test.beforeEach(async ({ page }) => {
      // Custom setup with customFields
      await page.addInitScript((config) => {
        (window as any).idpcConfig = {
          apiKey: "ak_go",
          populateOrganisation: true,
          populateCounty: true,
          autocomplete: true,
          postcodeLookup: false,
          postcodeLookupOverride: { checkKey: false },
          autocompleteOverride: {
            checkKey: false,
            defaultCountry: "GBR",
            detectCountry: false,
          },
          customFields: [config.selectors],
        };
      }, { selectors: customSelectors });

      await page.goto("/test/snapshot/fixtures/customer/custom-address-fields.html");
      await page.addScriptTag({ url: "http://localhost:60154/test/snapshot/fixtures/admin.js" });
      await page.addScriptTag({ url: "http://localhost:60154/test/snapshot/fixtures/start.js" });
      await page.waitForTimeout(2000);
    });

    test("Autocomplete", async ({ page }) => {
      await runAutocompleteSuite(page, suite);
    });
  });
});
