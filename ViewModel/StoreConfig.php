<?php
namespace Idealpostcodes\Ukaddresssearch\ViewModel;

use Idealpostcodes\Ukaddresssearch\Helper\Data;
use Magento\Framework\View\Element\Block\ArgumentInterface;

class StoreConfig implements ArgumentInterface
{
    /**
     * @var Data
     */
    private $helper;

    public function __construct(Data $helper)
    {
        $this->helper = $helper;
    }

    public function getConfig($field)
    {
        return $this->helper->getConfig($field);
    }
}
