<?php
/**
 * Copyright (c) IDDQD Ltd
 *
 * Customer Address Sanitization Plugin
 *
 * This plugin intercepts customer address data and sanitizes the city field
 * to prevent XSS attacks by stripping HTML/script tags.
 *
 * @package   Idealpostcodes_Ukaddresssearch
 * @author    Ideal Postcodes <support@ideal-postcodes.co.uk>
 * @copyright Ideal Postcodes Ltd
 * @license   MIT https://opensource.org/licenses/MIT
 * @link      https://ideal-postcodes.co.uk
 */

namespace Idealpostcodes\Ukaddresssearch\Plugin\Customer;

use Magento\Customer\Model\Address;

/**
 * Plugin to sanitize customer address data
 *
 * Intercepts the setCity method to strip HTML tags and prevent XSS attacks.
 */
class SanitizeAddressPlugin
{
    /**
     * Sanitize city field before setting it on customer address
     *
     * @param Address $subject The customer address object
     * @param string|null $city The city value being set
     * @return array Modified arguments for the original method
     */
    public function beforeSetCity(Address $subject, $city)
    {
        if ($city !== null && is_string($city)) {
            $city = $this->sanitizeText($city);
        }
        
        return [$city];
    }
    
    /**
     * Sanitize all address data before saving
     *
     * @param Address $subject The customer address object
     * @return void
     */
    public function beforeBeforeSave(Address $subject)
    {
        // Sanitize city if it exists
        $city = $subject->getCity();
        if ($city !== null && is_string($city)) {
            $subject->setCity($this->sanitizeText($city));
        }
        
        // Also sanitize other text fields
        $street = $subject->getStreet();
        if (is_array($street)) {
            $sanitizedStreet = array_map(function($line) {
                return is_string($line) ? $this->sanitizeText($line) : $line;
            }, $street);
            $subject->setStreet($sanitizedStreet);
        }
        
        // Sanitize company name
        $company = $subject->getCompany();
        if ($company !== null && is_string($company)) {
            $subject->setCompany($this->sanitizeText($company));
        }
    }
    
    /**
     * Sanitize text by removing HTML tags and JavaScript
     *
     * @param string $text
     * @return string
     */
    private function sanitizeText($text)
    {
        if (!is_string($text)) {
            return $text;
        }
        
        // Remove script/style tags AND their content
        $text = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $text);
        $text = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $text);
        
        // Strip all remaining HTML and PHP tags
        $text = strip_tags($text);
        
        // Remove any remaining JavaScript-like patterns
        $text = preg_replace('/javascript:/i', '', $text);
        $text = preg_replace('/on\w+\s*=/i', '', $text); // Remove event handlers
        
        // Trim whitespace
        return trim($text);
    }
}
