# Development Plan

Notion Task: 36d47c33d9ca80cc9f6bfe55d3808e96

## Goal

- Migrate test suite from Cypress to Playwright
- Fix tests for closed shadow DOM in postcode lookup component
- Improve test reliability and maintainability

## Current State

- Files involved:
  - `test/snapshot/cypress/` - 7 snapshot test specs
  - `test/e2e/cypress/` - 2 e2e test specs
  - `test/snapshot/cypress/support/suite.ts` - test utilities
  - `test/snapshot/cypress/support/e2e.ts` - setup commands
  - `package.json` - test scripts and dependencies
- Libraries involved:
  - Cypress ~14.0.0 (current)
  - Playwright (target)
  - @ideal-postcodes/api-fixtures
  - @ideal-postcodes/jsutil
- Main issue:
  - Postcode lookup now uses closed shadow DOM
  - Cypress selectors `.idpc-input`, `.idpc-button`, `.idpc-select` cannot pierce closed shadow
- Constraints:
  - Must maintain test coverage for all address forms
  - Need shadow DOM support for closed mode

## Possible Solutions

1. **Option A**: Full Playwright migration
   - Pros: Better shadow DOM support, modern API, faster execution
   - Cons: Complete rewrite needed, learning curve

2. **Option B**: Keep Cypress + workarounds for shadow DOM
   - Pros: Less work, familiar syntax
   - Cons: Closed shadow DOM not supported, hacky solutions needed

## Plan

- [x] Install Playwright and create config
  - [x] Run `npm install -D @playwright/test`
  - [x] Configure `playwright.config.ts` (file:// based, no http-server needed)
  - [x] Set up project structure
- [x] Create Playwright test utilities
  - [x] Shadow DOM helper for closed shadow root access
  - [x] Port `suite.ts` assertions to Playwright
  - [x] Port `e2e.ts` setup commands
- [x] Migrate snapshot tests (7 files)
  - [x] `billing.spec.ts`
  - [x] `shipping.spec.ts`
  - [x] `onepage.spec.ts`
  - [x] `customer.spec.ts`
  - [x] `admin-orders.spec.ts`
  - [x] `admin-orders-edit.spec.ts`
  - [x] `multishipping.spec.ts`
- [x] Migrate e2e tests (2 files)
  - [x] `admin.spec.ts`
  - [x] `checkout.spec.ts`
- [x] Fix shadow DOM selectors for postcode lookup
  - [x] Use `page.evaluate()` to access closed shadow root
  - [x] Create reusable locator helpers
  - [x] Test postcode input, button, and select
- [x] Update package.json scripts
  - [x] Replace `test:snapshot` commands
  - [x] Replace `test:e2e` commands
  - [x] Keep Cypress scripts as fallback (`test:cypress:*`)
- [ ] Remove Cypress dependencies (optional, keep for now)
  - [ ] Remove `cypress` package
  - [ ] Remove `@types/cypress`
  - [ ] Remove `@types/mocha`
  - [ ] Clean up old cypress directories

## Current Focus

> Migration complete - all tests passing

## Progress Log

- [2026-05-27 12:07]: Created migration plan
- [2026-05-27 12:19]: Installed Playwright, created config, migrated all tests
- [2026-05-27 12:38]: Fixed shadow DOM access with `__idpcShadowRoot` property
- [2026-05-27 12:54]: Fixed race condition - set workers: 1, all 22 tests passing
