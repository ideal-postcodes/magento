# City Validation Override

## Overview

This module includes a custom override for Magento 2's city field validation rules to support real-world city names that contain special characters.

## Problem

The default Magento 2 city validation uses a restrictive regex pattern (`/^[a-zA-Z\s]+$/`) that only allows:
- Letters (A-Z, a-z)
- Spaces

This causes validation failures for legitimate city names such as:
- **St. Helen** (contains period)
- **St. Moritz** (contains period)
- **Brighton & Hove** (contains ampersand)
- **29 Palms** (contains numbers)
- **King's Lynn** (contains apostrophe)
- **Ashton-under-Lyne** (contains hyphens)

## Solution

The `Setup/UpgradeData.php` script removes the restrictive validation rules from the city attribute, keeping only:
- **Minimum length**: 1 character
- **Maximum length**: 255 characters
- **XSS Protection**: HTML/XML tags are stripped via `input_filter: striptags`

This allows all legitimate characters including:
- **Letters**: A-Z, a-z
- **Numbers**: 0-9
- **Spaces**: ` `
- **Hyphens**: `-`
- **Periods**: `.`
- **Ampersands**: `&`
- **Parentheses**: `(`, `)`
- **Apostrophes**: `'`
- **Any other special characters**: /, #, etc.

## Implementation Details

### Files Modified/Created

1. **etc/module.xml**
   - Updated `setup_version` to `3.1.3`
   - Added dependencies: `Magento_Customer`, `Magento_Checkout`

2. **etc/di.xml** (NEW)
   - Configures plugins for Quote and Customer address models
   - Intercepts address data to sanitize before saving

3. **Plugin/Quote/SanitizeAddressPlugin.php** (NEW)
   - Plugin for `Magento\Quote\Model\Quote\Address`
   - Strips HTML tags from city, street, and company fields in checkout
   - Runs on `beforeSetCity()` and `beforeBeforeSave()`

4. **Plugin/Customer/SanitizeAddressPlugin.php** (NEW)
   - Plugin for `Magento\Customer\Model\Address`
   - Strips HTML tags from city, street, and company fields in customer addresses
   - Runs on `beforeSetCity()` and `beforeBeforeSave()`

5. **Setup/UpgradeData.php**
   - Implements `UpgradeDataInterface`
   - Removes restrictive validation rules from city attribute
   - Sets `frontend_class` to null to remove frontend validation
   - Adds `input_filter: striptags` for additional backend protection
   - Runs automatically during `setup:upgrade`

### How It Works

1. The upgrade script runs when the module version is upgraded to 3.1.3 or higher
2. It retrieves the `city` attribute from the customer address entity type
3. It removes all restrictive validation rules (like `validate-alpha`)
4. It keeps only `min_text_length` and `max_text_length` constraints
5. It removes the `frontend_class` validation
6. It adds `input_filter: striptags` to strip HTML/XML tags for XSS protection
7. The simplified validation rules are stored in the `customer_eav_attribute` table
8. Frontend JavaScript validation (in checkout and address forms) now only checks length

**Plugin-Based XSS Protection (Multi-Layer Defense):**

9. **Quote Address Plugin** intercepts checkout address data:
   - Runs `beforeSetCity()` when city is set via API/form
   - Runs `beforeBeforeSave()` before saving to `quote_address` table
   - Strips HTML tags using PHP's `strip_tags()` function
   
10. **Customer Address Plugin** intercepts customer account address data:
    - Runs `beforeSetCity()` when city is set
    - Runs `beforeBeforeSave()` before saving to `customer_address_entity` table
    - Also sanitizes street and company fields
    
11. This multi-layer approach ensures XSS protection even when:
    - Data comes from REST API or GraphQL (bypasses EAV input_filter)
    - Data is set programmatically by other modules
    - Data is imported or migrated

## Installation

After adding these files to your module, run:

```bash
bin/magento module:enable Idealpostcodes_Ukaddresssearch
bin/magento setup:upgrade
bin/magento setup:di:compile
bin/magento cache:flush
```

## Testing

1. Navigate to checkout or customer address form
2. Enter a city name with special characters (e.g., "St. Helen")
3. The form should validate successfully without errors
4. Submit the form to verify the address is saved correctly

## Verification

Check the database to verify the change:

```sql
SELECT validate_rules 
FROM customer_eav_attribute 
WHERE attribute_id = (
  SELECT attribute_id 
  FROM eav_attribute 
  WHERE attribute_code = 'city' 
    AND entity_type_id = 2
);
```

The `validate_rules` column should contain:
```json
{
  "max_text_length": 255,
  "min_text_length": 1,
  "input_validation": "length"
}
```

Also verify the input_filter and frontend_class:
```sql
SELECT frontend_class, input_filter
FROM eav_attribute 
WHERE attribute_code = 'city' 
  AND entity_type_id = 2;
```

Should return:
- `frontend_class`: `NULL`
- `input_filter`: `striptags`

## Compatibility

- **Magento Version**: 2.3.x, 2.4.x
- **PHP Version**: 5.5+, 7.x, 8.x
- **Affects**: 
  - Checkout address forms
  - Customer account address forms
  - Admin order creation forms

## Security

### XSS Protection (Multi-Layer Defense)

The module implements **three layers** of XSS (Cross-Site Scripting) protection:

#### Layer 1: EAV Input Filter
- **What**: `input_filter: striptags` on the city attribute
- **When**: Applied during standard form processing
- **Coverage**: Customer account forms, admin forms

#### Layer 2: Quote Address Plugin
- **What**: `Plugin/Quote/SanitizeAddressPlugin.php`
- **When**: Intercepts checkout address data before saving
- **Coverage**: Checkout, REST API, GraphQL
- **Methods**: `beforeSetCity()`, `beforeBeforeSave()`

#### Layer 3: Customer Address Plugin
- **What**: `Plugin/Customer/SanitizeAddressPlugin.php`
- **When**: Intercepts customer address data before saving
- **Coverage**: Customer account, admin, API
- **Methods**: `beforeSetCity()`, `beforeBeforeSave()`

**Examples:**
- Input: `St. Helen<script>alert('xss')</script>` → Saved as: `St. Helen`
- Input: `Brighton<b>test</b>` → Saved as: `Brightontest`
- Input: `King's Lynn` → Saved as: `King's Lynn` (no change, legitimate input)

**Protection level**: 
- ✅ Blocks `<script>`, `<iframe>`, `<img>` and all other HTML tags
- ✅ Prevents stored XSS attacks in database
- ✅ Works in checkout (quote_address table)
- ✅ Works in customer addresses (customer_address_entity table)
- ✅ Applied on frontend, backend, REST API, and GraphQL
- ✅ Processed server-side, cannot be bypassed by client manipulation
- ✅ Also sanitizes street and company fields

### Additional Security Notes

- **Multi-layer defense**: Even if one layer fails, others provide backup protection
- **Plugin-based**: Intercepts data at the model level, before database insertion
- **Comprehensive**: Covers all entry points (forms, API, programmatic)
- Magento also applies output escaping when displaying city names in templates
- This approach is more secure than regex-based validation which can have bypass vulnerabilities

## Known Issues

This override affects the **frontend JavaScript validation** only. If you have custom backend validation or third-party modules that validate city names, they may need separate updates.

## Rollback

To revert to default Magento validation:

1. Remove or comment out the upgrade script
2. Manually update the `eav_attribute` table to restore the original `validate_rules`
3. Run `bin/magento cache:flush`

## References

- Magento GitHub Issue: [#39854](https://github.com/magento/magento2/issues/39854)
- Related to: `Magento_Ui/js/lib/validation/rules.js`, `mage/validation.js`
