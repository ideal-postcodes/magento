<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Magento%20Extension%20Logo@3x.png" alt="UK Address Search and Validation Magento Extension">
</h1>

> UK Address Search and Validation Magento Extension

[![Packagist Version](https://img.shields.io/packagist/v/idealpostcodes/module-ukaddresssearch)](https://packagist.org/packages/idealpostcodes/module-ukaddresssearch)
![PHP from Packagist](https://img.shields.io/packagist/php-v/idealpostcodes/module-ukaddresssearch)
![CI (Bindings)](https://github.com/ideal-postcodes/magento/workflows/CI%20(Bindings)/badge.svg)

This extension enables [Ideal-Postcodes.co.uk](https://ideal-postcodes.co.uk) address validation for UK addresses on a Magento store.

Tested on Magento 2.1 - 2.4 on PHP 7.1-7.3

![Magento 2.1 CI](https://github.com/ideal-postcodes/magento/workflows/Magento%202.1%20CI/badge.svg)
![Magento 2.2 CI](https://github.com/ideal-postcodes/magento/workflows/Magento%202.2%20CI/badge.svg)
![Magento 2.3 CI](https://github.com/ideal-postcodes/magento/workflows/Magento%202.3%20CI/badge.svg)
![Magento 2.4 CI](https://github.com/ideal-postcodes/magento/workflows/Magento%202.4%20CI/badge.svg)

See our [guide](https://ideal-postcodes.co.uk/guides/magento) for installation and configuration instructions.

[Get in contact](https://ideal-postcodes.co.uk/support) if you need assistance or have questions. Raise an issue for bugs or feature requests.

## Links

- [Guide](https://ideal-postcodes.co.uk/guides/magento)
- [Magento Marketplace](https://marketplace.magento.com/idealpostcodes-module-ukaddresssearch.html)
- [Ideal Postcodes](https://ideal-postcodes.co.uk/magento)
- [Repository](https://github.com/ideal-postcodes/magento)
- [Packagist](https://packagist.org/packages/idealpostcodes/module-ukaddresssearch)
- [Changelog](https://github.com/ideal-postcodes/magento/blob/main/CHANGELOG.md)
- [Releases](https://github.com/ideal-postcodes/magento/releases)
- [Support](https://chat.ideal-postcodes.co.uk/support)
- [Dev Chat](https://chat.ideal-postcodes.co.uk)

## Hiding Address Fields Behind Postcode Lookup

Postcode Lookup can hide address inputs until an address is selected, so that only the postcode search box is shown. Paste the following into **Stores > Configuration > Ideal Postcodes > Advanced > PostcodeLookup Override**:

```json
{
  "hide": ["[name=\"postcode\"]"]
}
```

Each entry is a CSS selector (resolved within the address form) or any option accepted by [Postcode Lookup's `hide`](https://docs.ideal-postcodes.co.uk/postcode-lookup/reference). When a selector points at an input, its surrounding `.field` wrapper (label included) is hidden. Hidden fields are revealed when an address is selected, when the customer clicks "Enter address manually", or when a non-UK country is chosen. Add more selectors (e.g. `[name=\"street[0]\"]`, `[name=\"city\"]`) to hide further fields.

## Screenshots

![Postcode Lookup](https://img.ideal-postcodes.co.uk/magento-postcode-lookup-checkout.png)
![Address Autocomplete](https://img.ideal-postcodes.co.uk/magento-address-autocomplete-shipping.png)
![Configuration](https://img.ideal-postcodes.co.uk/magento-configuration-stores-3.png)

## Licence

MIT
