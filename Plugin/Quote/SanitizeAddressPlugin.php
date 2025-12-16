<?php
/**
 * Copyright (c) IDDQD Ltd
 *
 * Quote Address Sanitization Plugin
 *
 * This plugin intercepts quote address data (used in checkout) and sanitizes
 * the city field to prevent XSS attacks by stripping HTML/script tags.
 *
 * @package   Idealpostcodes_Ukaddresssearch
 * @author    Ideal Postcodes <support@ideal-postcodes.co.uk>
 * @copyright Ideal Postcodes Ltd
 * @license   MIT https://opensource.org/licenses/MIT
 * @link      https://ideal-postcodes.co.uk
 */

namespace Idealpostcodes\Ukaddresssearch\Plugin\Quote;

use Magento\Quote\Model\Quote\Address;

/**
 * Plugin to sanitize address data in checkout
 *
 * Intercepts the setCity method to strip HTML tags and prevent XSS attacks.
 * This is necessary because checkout uses REST API/GraphQL which bypasses
 * the standard EAV input_filter attribute setting.
 */
class SanitizeAddressPlugin
{
    /**
     * Sanitize city field before setting it on quote address
     *
     * This plugin intercepts the setCity() method call and strips any HTML/XML
     * tags from the input to prevent stored XSS attacks.
     *
     * @param Address $subject The quote address object
     * @param string|null $city The city value being set
     * @return array Modified arguments for the original method
     */
    public function beforeSetCity(Address $subject, $city)
    {
        if ($city !== null && is_string($city)) {
            // Remove script/style tags AND their content
            $city = preg_replace('/<script\b[^>]*>(.*?)<\/script>/is', '', $city);
            $city = preg_replace('/<style\b[^>]*>(.*?)<\/style>/is', '', $city);
            
            // Strip all remaining HTML and PHP tags
            $city = strip_tags($city);
            
            // Remove any remaining JavaScript-like patterns
            $city = preg_replace('/javascript:/i', '', $city);
            $city = preg_replace('/on\w+\s*=/i', '', $city); // Remove event handlers like onclick=
            
            // Trim whitespace
            $city = trim($city);
        }
        
        return [$city];
    }
    
    /**
     * Sanitize all address data before saving
     *
     * This provides an additional layer of protection by sanitizing
     * all address fields that might contain user input.
     *
     * @param Address $subject The quote address object
     * @return void
     */
    public function beforeBeforeSave(Address $subject)
    {
        // Sanitize city if it exists
        $city = $subject->getCity();
        if ($city !== null && is_string($city)) {
            $subject->setCity($this->sanitizeText($city));
        }
        
        // Also sanitize other text fields that might be vulnerable
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
