ARG BASE_IMAGE=idealpostcodes/magento-test:m2.4-php8.1
FROM $BASE_IMAGE

COPY docker/install-magento /usr/local/bin/install-magento
RUN chmod u+x /usr/local/bin/install-magento

COPY ./docker/compile-magento /usr/local/bin/compile-magento
RUN chmod u+x /usr/local/bin/compile-magento

COPY ./docker/upgrade-magento /usr/local/bin/upgrade-magento
RUN chmod u+x /usr/local/bin/upgrade-magento

COPY --chown=www-data:www-data . app/code/Idealpostcodes/Ukaddresssearch
