FROM idealpostcodes/magento-test:m2.3-php7.2

COPY --chown=www-data:www-data . app/code/Idealpostcodes/Ukaddresssearch
