/// <reference types="cypress" />;
const version = Cypress.env("MAGENTO_VERSION");

const logout = () => {
  if (version == "2.2") {
    cy.get('a[title="My Account"]').click();
    cy.wait(500);
    cy.get(".admin__action-dropdown-menu").within(() => {
      cy.get("a").contains("Sign Out").click();
    });
    return;
  }
  cy.visit("/index.php/admin/admin/auth/logout/");
};

const navigateToSettings = () => {
  if (version == "2.2") {
    cy.wait(500);
    cy.get("#menu-magento-backend-stores").click();
    cy.wait(500);
    cy.get("li#menu-magento-backend-stores .submenu").within(() => {
      cy.get("a").contains("Configuration").click();
    });
    cy.wait(500);
    cy.get(".admin__page-nav-title.title._collapsible")
      .contains("Services")
      .click();
    cy.wait(500);
    cy.get(".admin__page-nav-link.item-nav")
      .contains("Ideal Postcodes")
      .click();
    cy.wait(500);
    cy.get("#idealpostcodes_required-head").click();
    cy.wait(500);
    return;
  }
  cy.visit("/index.php/admin/admin/system_config/edit/section/idealpostcodes");
};
Cypress.on("uncaught:exception", (err) => {
  console.log(err);
  return false;
});

describe("Admin", () => {
  after(() => {
    logout();
  });

  const apiKey = Cypress.env("API_KEY");

  it("Can navigate to config page", () => {
    // Login to admin page
    cy.visit("/admin");
    cy.get("#username").type("admin");
    cy.get("#login").type("foobar21");
    cy.get("form").contains("Sign in").click();
    cy.url().should("include", "/index.php/admin/admin/dashboard");

    // Visit Ideal Postcodes settings
    navigateToSettings();

    cy.url().should(
      "include",
      "/index.php/admin/admin/system_config/edit/section/idealpostcodes"
    );
    cy.get("#idealpostcodes_required_api_key")
      .clear({ force: true })
      .type(apiKey, { force: true });
    cy.wait(500);
    cy.contains("Save Config").click();
    cy.wait(1000);
    cy.get('div[data-ui-id="messages-message-success"]').should(($div) => {
      expect($div.text(), "ID").to.equal("You saved the configuration.");
    });
  });
});
