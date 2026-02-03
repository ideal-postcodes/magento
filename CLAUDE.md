# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Magento 2 extension (`Idealpostcodes_Ukaddresssearch`) providing UK address search via the Ideal Postcodes API. Supports postcode lookup and address autocomplete for checkout, customer accounts, and admin order management.

## Development Commands

### Docker Environment (Magento)

```bash
make up              # Build and initialize Magento (includes init)
make down            # Shutdown services
make shell           # Bash into web container
make cache-flush     # Clear Magento cache
make fix-session-expire  # Fix session timeout (sets base URL to 127.0.0.1)
make logs            # Tail all Docker logs
```

PHP version selection: `PHP=81 make up` or `PHP=82 make up`

### JavaScript/TypeScript Build

```bash
npm run build        # Production build (Rollup)
npm run watch        # Watch mode for development
npm run lint         # ESLint check
npm run lint-fix     # Auto-fix linting
```

### Testing

```bash
npm test             # Run snapshot tests (Cypress against static fixtures)
npm test:open        # Interactive snapshot testing
npm test:e2e         # E2E tests against live Magento (requires `make up`)
npm test:e2e:open    # Interactive E2E testing
```

Tests use Cypress. Snapshot tests run against HTML fixtures; E2E tests require the Docker environment running on localhost:3000.

## Architecture

### TypeScript Source (`lib/`)

Core extension logic compiled to minified bundles:
- `extension.ts` - Main logic: `setupPostcodeLookup()`, `setupAutocomplete()`, `hoistCountry()`, field binding
- `store.ts` → `view/base/web/binding.min.js` (frontend bundle)
- `admin.ts` → `view/base/web/admin.min.js` (admin bundle)

Form bindings: `billing.ts`, `shipping.ts`, `customer.ts`, `multishipping.ts`, `admin-orders.ts`, `admin-orders-edit.ts`, `admin-customers.ts`

### PHP Components

- `Helper/Data.php` - Configuration retrieval (API key, enabled flags, field mappings)
- `ViewModel/StoreConfig.php` - Frontend JSON config for `x-magento-init`
- `ViewModel/AdminConfig.php` - Admin panel config
- `Plugin/Customer/SanitizeAddressPlugin.php` - Input sanitization for customer addresses
- `Plugin/Quote/SanitizeAddressPlugin.php` - Input sanitization for quote addresses

### Magento Integration Flow

1. `layout/*.xml` injects config blocks
2. Templates (`store.phtml`, `admin.phtml`) initialize JS via `x-magento-init`
3. ViewModels serialize configuration to JSON
4. RequireJS modules (`store-init.js`, `admin-init.js`) call `window.idpcStart()`
5. Compiled TypeScript attaches to DOM elements
6. Plugins sanitize address input before save

### Configuration

Admin config form: `etc/adminhtml/system.xml`
Default values: `etc/config.xml`
CSP whitelist: `etc/csp_whitelist.xml` (allows `*.ideal-postcodes.co.uk`)

### Dependencies

Runtime: `@ideal-postcodes/address-finder`, `@ideal-postcodes/postcode-lookup`

Build output targets ES5 for IE11 compatibility.
