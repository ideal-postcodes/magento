import { test, expect, Page, Locator } from "@playwright/test";
import { address as addresses } from "@ideal-postcodes/api-fixtures";
import { selectors } from "../../../lib/billing";
import { Selectors } from "@ideal-postcodes/jsutil";
import { Address } from "@ideal-postcodes/api-typings";

const MAGENTO_VERSION = process.env.MAGENTO_VERSION || "2.4";
const address = addresses.jersey;

interface Suite {
  scope: string;
  selectors: Selectors;
  address: Address;
}

const suite: Suite = {
  scope: ".checkout-shipping-address",
  selectors,
  address,
};

const waitPerVersion = async (page: Page, time: number) => {
  const check = ["2.3", "2.4"];
  if (!check.includes(MAGENTO_VERSION)) {
    await page.waitForTimeout(time);
  }
};

const assertions = async (page: Page, scope: Locator, selectors: Selectors, address: Address) => {
  await expect(scope.locator(selectors.line_1)).toHaveValue(address.line_1);

  const line3Exists = selectors.line_3 ? await scope.locator(selectors.line_3).count() > 0 : false;

  if (selectors.line_3 && line3Exists) {
    if (selectors.line_2) {
      await expect(scope.locator(selectors.line_2)).toHaveValue(address.line_2);
    }
    if (selectors.line_3) {
      await expect(scope.locator(selectors.line_3)).toHaveValue(address.line_3);
    }
  } else {
    if (selectors.line_2) {
      await expect(scope.locator(selectors.line_2)).toHaveValue(
        `${address.line_2}, ${address.line_3}`
      );
    }
  }

  const town = address.post_town.toLowerCase();
  const formattedTown = town.charAt(0).toUpperCase() + town.slice(1);
  await expect(scope.locator(selectors.post_town)).toHaveValue(formattedTown);
  await expect(scope.locator(selectors.country)).toHaveValue("JE");
  await expect(scope.locator(selectors.postcode)).toHaveValue(address.postcode);
};

test.describe("Checkout", () => {
  test.beforeEach(async ({ page }) => {
    // Ignore uncaught exceptions
    page.on("pageerror", (error) => {
      console.log(error);
    });

    // Add product and visit checkout
    await page.goto("/index.php/simple-product-113.html");
    await waitPerVersion(page, 5000);
    await page.locator("#product-addtocart-button").click();
    await waitPerVersion(page, 5000);
    await expect(page.locator(".message-success > div")).toContainText(
      "You added Simple Product 113"
    );
    await page.goto("/index.php/checkout/");
    await waitPerVersion(page, 5000);
  });

  test("Postcode Lookup", async ({ page }) => {
    const scope = page.locator(suite.scope);
    const { selectors, address } = suite;

    await scope.locator(selectors.country).selectOption("GB", { force: true });
    await page.waitForTimeout(1000);

    // Shadow DOM interaction for postcode lookup
    const shadowHost = scope.locator(".idpc_lookup_host").first();
    await shadowHost.evaluate((el, postcode) => {
      const shadow = (el as any).__idpcShadowRoot;
      const input = shadow?.querySelector(".idpc-input, input") as HTMLInputElement;
      if (input) {
        input.value = postcode;
        input.dispatchEvent(new Event("input", { bubbles: true }));
      }
    }, address.postcode);

    await shadowHost.evaluate((el) => {
      const shadow = (el as any).__idpcShadowRoot;
      const button = shadow?.querySelector("button") as HTMLButtonElement;
      button?.click();
    });

    await page.waitForTimeout(3000);

    await shadowHost.evaluate((el) => {
      const shadow = (el as any).__idpcShadowRoot;
      const select = shadow?.querySelector("select") as HTMLSelectElement;
      if (select) {
        select.value = "0";
        select.dispatchEvent(new Event("change", { bubbles: true }));
      }
    });

    await assertions(page, scope, selectors, address);
  });

  test("Autocomplete", async ({ page }) => {
    const scope = page.locator(suite.scope);
    const { selectors, address } = suite;

    await scope.locator(selectors.country).selectOption("GB", { force: true });
    await page.waitForTimeout(2000);

    await scope.locator(selectors.line_1).clear();
    await scope.locator(selectors.line_1).fill(address.line_1);
    await page.waitForTimeout(3000);

    await page.locator(".idpc_ul li").first().click({ force: true });
    await assertions(page, scope, selectors, address);
  });
});
