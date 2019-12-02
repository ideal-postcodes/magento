<h1 align="center">
  <img src="https://img.ideal-postcodes.co.uk/Magento%20Extension%20Logo@3x.png" alt="UK Address Search and Validation Magento Extension">
</h1>

> UK Address Search and Validation Magento Extension

![Packagist Version](https://img.shields.io/packagist/v/idealpostcodes/module-ukaddresssearch)
![PHP from Packagist](https://img.shields.io/packagist/php-v/idealpostcodes/module-ukaddresssearch)

This extension enables [Ideal-Postcodes.co.uk](https://ideal-postcodes.co.uk) address validation for UK addresses on a magento store

[Get in contact](https://ideal-postcodes.co.uk/support) if you need assistance or have questions. Raise an issue for bugs or feature requests

## Features

- Adds UK address validation to address forms:
  - User billing address
  - User shipping address
  - User address book
- Allows for following address selection mode:
  - [Postcode Lookup](https://img.ideal-postcodes.co.uk/billing-page-select-address.png)
  - [Address Autocomplete](https://img.ideal-postcodes.co.uk/billing-page-autocomplete.png)
- Address search and validation enabled for [countries covered by Postcode Address File](https://ideal-postcodes.co.uk/guides/supported-territories)
- Hides address search for non-UK territories
- API Key and other configuration scoped by website, store or view
- Asynchronously performs checks if key is active and usable
  - Checks if your API Key is currently usable before presenting your users with address search fields
  - Prevents errors from occuring if your key runs out of balance or is accidentally misconfigured
- **Option** hoists country selection above address fields
- **Option** populate Company name based on address
- **Option** populate county field
- [Administration Page](https://img.ideal-postcodes.co.uk/idpc-options.png)
  - Insert API Key credentials

## Links

- [Ideal Postcodes](https://ideal-postcodes.co.uk/magento)
- [Repository](https://github.com/ideal-postcodes/magento)
- [Changelog](https://github.com/ideal-postcodes/magento/blob/master/CHANGELOG.md)
- [Releases](https://github.com/ideal-postcodes/magento/releases)
- [Guide](https://ideal-postcodes.co.uk/guides/magento)
- [Support](https://chat.ideal-postcodes.co.uk/support)
- [Dev Chat](https://chat.ideal-postcodes.co.uk)

## Installation

This extension can be retrieved using the following methods

- [Composer](#composer)
- [Manual](#manual)
- [Magento Connect](#magento-connect)

Once the extension is copied, you will need to run the [final install steps](#final-install-steps)

### Composer

Install via composer with

```bash
composer require idealpostcodes/module-ukaddresssearch
```

### Manual

This repository needs to be loaded into your Magento directory. The following directory needs to be present in your Magento codebase `app/code/Idealpostcodes/Ukaddresses`

Inside of `app/code/Idealpostcodes/Ukaddresses` you can retrieve the extension by

- Download and untar from [our releases page](https://github.com/ideal-postcodes/magento/releases)
- Git clone this project `git clone -depth=1 https://github.com/ideal-postcodes/magento.git`
- Git clone a specific version `git clone --branch <tag> -depth=1 https://github.com/ideal-postcodes/magento.git`

### Magento Connect

Currently not available

### Final Install Steps

You may enable and install this extension with the following commands

```bash
magento module:enable Idealpostcodes_Ukaddresssearch
magento setup:upgrade
magento setup:di:compile
magento setup:static-content:deploy -f
```

After installation is complete you will need to apply your API Key

### Configuration

Apply your API Key via the Configuration dashboard.

You can find this on your administration page under Stores Menu -> Configuration -> Services Tab -> Ideal Postcodes.

![Configuration](http://img.ideal-postcodes.co.uk/idpc-options-cropped.png)

## Run Locally

If you have `docker` and `make` installed, you can run and test this extension locally on a clean magento install with a single command:

```bash
make bootstrap
```

This will build a new magento store on a docker image with this extension mounted, launch required services (i.e. MariaDB) with `docker-compose` and execute the necessary steps to bootstrap magento and initialise the extension. The Magento store will be served on `localhost:3000`. You can access the administration page via `http://localhost:3000/admin` with user name `admin` and password `foobar21`.

The `Makefile` contains a number of helper methods to launch and bootstrap Magento container with extension. To see current list of methods, run `make`.

## Screenshots

![Postcode Lookup](https://img.ideal-postcodes.co.uk/billing-page-select-address.png)
![Address Autocomplete](https://img.ideal-postcodes.co.uk/billing-page-autocomplete.png)
![Configuration](https://img.ideal-postcodes.co.uk/idpc-options.png)

## Licence

MIT
