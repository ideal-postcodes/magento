import { test, expect } from "@playwright/test";

const MAGENTO_VERSION = process.env.MAGENTO_VERSION || "2.4";

const logout = async (page: any) => {
  if (MAGENTO_VERSION === "2.2") {
    await page.locator('a[title="My Account"]').click();
    await page.waitForTimeout(500);
    await page.locator(".admin__action-dropdown-menu a").filter({ hasText: "Sign Out" }).click();
    return;
  }
  await page.goto("/index.php/admin/admin/auth/logout/");
};

const navigateToSettings = async (page: any) => {
  if (MAGENTO_VERSION === "2.2") {
    await page.waitForTimeout(500);
    await page.locator("#menu-magento-backend-stores").click();
    await page.waitForTimeout(500);
    await page.locator("li#menu-magento-backend-stores .submenu a").filter({ hasText: "Configuration" }).click();
    await page.waitForTimeout(500);
    await page.locator(".admin__page-nav-title.title._collapsible").filter({ hasText: "Services" }).click();
    await page.waitForTimeout(500);
    await page.locator(".admin__page-nav-link.item-nav").filter({ hasText: "Ideal Postcodes" }).click();
    await page.waitForTimeout(500);
    await page.locator("#idealpostcodes_required-head").click();
    await page.waitForTimeout(500);
    return;
  }
  await page.goto("/index.php/admin/admin/system_config/edit/section/idealpostcodes");
};

test.describe("Admin", () => {
  test.afterAll(async ({ browser }) => {
    const page = await browser.newPage();
    await logout(page);
    await page.close();
  });

  const apiKey = process.env.API_KEY ?? "";

  test.skip(!process.env.API_KEY, "API_KEY environment variable is required");

  test("Can navigate to config page", async ({ page }) => {
    // Ignore uncaught exceptions
    page.on("pageerror", (error) => {
      console.log(error);
    });

    // Login to admin page
    await page.goto("/admin");
    await page.locator("#username").fill("admin");
    await page.locator("#login").fill("foobar21");
    await page.getByRole("button", { name: "Sign in" }).click();
    await expect(page).toHaveURL(/.*\/index\.php\/admin\/admin\/dashboard/);

    // Visit Ideal Postcodes settings
    await navigateToSettings(page);

    await expect(page).toHaveURL(
      /.*\/index\.php\/admin\/admin\/system_config\/edit\/section\/idealpostcodes/
    );

    // Expand Required section and fill API key
    await page.locator("#idealpostcodes_required-head").click();
    await page.locator("#idealpostcodes_required_api_key").fill(apiKey);

    // Expand Admin section and fill autocomplete override
    await page.locator("#idealpostcodes_admin-head").click();
    await page.locator("#idealpostcodes_admin_autocomplete_override").fill(
      '{"defaultCountry": "GBR", "detectCountry": false}'
    );
    await page.waitForTimeout(500);
    await page.getByText("Save Config").click();
    await page.waitForTimeout(1000);

    const successMessage = page.locator('div[data-ui-id="messages-message-success"]');
    await expect(successMessage).toHaveText("You saved the configuration.");
  });
});
