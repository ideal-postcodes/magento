(function() {
  var toBoolean = function(arg, def) {
    if (arg === undefined) return def;
    return arg;
  };

  /**
   * IdpcBinding
   *
   * Binds Ideal Postcodes address search functionality to magento frontend components
   */
  var IdpcBinding = function(options) {
    this.api_key = options.api_key;

    // Exit if key not present
    if (typeof this.api_key !== "string") return;
    if (this.api_key.trim().length === 0) return;

    this.container = options.container;
    this.$ = options.jQuery || options.$;

    // Should postcode lookup be enabled
    this.postcodeLookup = toBoolean(options.postcodeLookup, true);
    // Should address autocomplete be enabled
    this.addressAutocomplete = toBoolean(options.addressAutocomplete, true);
    // Should address search update organisation field
    this.populateOrganisation = toBoolean(options.populateOrganisation, true);
    // Insert county as region. Deactiveated by default - county data should be discarded if possible
    this.requireCounty = toBoolean(options.requireCounty, false);
    // Should country field be hoisted up as first address field
    this.hoistCountryField = toBoolean(options.hoistCountryField, true);

    this.lineOneIdentifier = options.lineOneIdentifier || '[name="street[0]"]';
    this.lineTwoIdentifier = options.lineTwoIdentifier || '[name="street[1]"]';
    this.postcodeIdentifier = options.postcodeIdentifier || '[name="postcode"]';
    this.postTownIdentifier = options.postTownIdentifier || '[name="city"]';
    this.organisationIdentifier =
      options.organisationIdentifier || '[name="company"]';
    this.countyIdentifier = options.countyIdentifier || '[name="region"]';
    this.countryIdentifier = options.countryIdentifier || '[name="country_id"]';
    this.addressLinesIdentifier =
      options.addressLinesIdentifier || "fieldset.field";

    this._interval = null;
    this._autocompleteInstances = [];
    this._postcodeLookupInstances = [];

    this.load();
    this.watch();
  };

  IdpcBinding.prototype.$container = function() {
    return this.$(this.container);
  };

  IdpcBinding.prototype.$lineOne = function() {
    return this.$container().find(this.lineOneIdentifier);
  };

  IdpcBinding.prototype.$lineTwo = function() {
    return this.$container().find(this.lineTwoIdentifier);
  };

  IdpcBinding.prototype.$organisation = function() {
    return this.$container().find(this.organisationIdentifier);
  };

  IdpcBinding.prototype.$postTown = function() {
    return this.$container().find(this.postTownIdentifier);
  };

  IdpcBinding.prototype.$postcode = function() {
    return this.$container().find(this.postcodeIdentifier);
  };

  IdpcBinding.prototype.$county = function() {
    return this.$container().find(this.countyIdentifier);
  };

  IdpcBinding.prototype.$country = function() {
    return this.$container().find(this.countryIdentifier);
  };

  // Set country field according to full country name `country`
  IdpcBinding.prototype.setCountry = function(address) {
    var country;
    if (address.country === "Channel Islands") {
      country = address.post_town;
    } else {
      country = address.country;
    }

    var $country = this.$country();
    if ($country.length === 0) return;

    if ($country.is("select")) {
      // Convert to ISO code if select field
      this.$country().val(IdpcBinding.toIso[country.toLowerCase()]);
      // Manually trigger change event to propagate any changes magento needs to do
      $country.trigger("change");
    }
    if ($country.is("input")) this.$country().val(country);
  };

  // Hoists country field up before address lines
  IdpcBinding.prototype.hoistCountry = function() {
    if (this.hoistCountryField !== true) return;

    $countryContainer = this.$country().closest("div.field");
    $linesContainer = this.$linesContainer();
    if ($countryContainer.length === 0) return;
    if ($linesContainer.length === 0) return;
    $countryContainer.insertBefore($linesContainer);
  };

  /**
   * Returns the containing div of address lines
   */
  IdpcBinding.prototype.$linesContainer = function() {
    return this.$lineOne().closest(this.addressLinesIdentifier);
  };

  // Apply address search functionality within container
  IdpcBinding.prototype.load = function() {
    // Guard: Exit if instantiated
    if (this.loaded()) return;
    // Guard: Check if line 1 address field is present
    if (this.addressFieldsPresent() !== true) return;

    this.hoistCountry();
    this.applyAutocomplete();
    this.applyPostcodeLookup();
    this.observeCountry();
    this.loaded(true);
  };

  // Listens for change in country selection. Activates plugins where appropriate
  IdpcBinding.prototype.observeCountry = function() {
    var self = this;
    this.$country().change(function() {
      self.detectCountry();
    });
  };

  // Check if address fields are present by looking for line one
  IdpcBinding.prototype.addressFieldsPresent = function() {
    return this.$lineOne().length !== 0;
  };

  // Determines whether address search has been applied within container
  // - If boolean argument provided, marks search as applied
  IdpcBinding.prototype.loaded = function(attrValue) {
    var $container = this.$container();

    if (attrValue === true) {
      $container.attr("idpc", "true");
      return attrValue;
    }

    return $container.attr("idpc");
  };

  IdpcBinding.prototype.handleAddressSelection = function(address) {
    var lineTwo = [address.line_2, address.line_3]
      .filter(function(line) {
        return line.trim().length > 0;
      })
      .join(", ")
      .trim();
    this.updateField(this.$lineOne, address.line_1);
    this.updateField(this.$lineTwo, lineTwo);
    this.updateField(this.$postTown, address.post_town);
    this.updateField(this.$postcode, address.postcode);

    this.setCountry(address);
    if (this.requireCounty === true) {
      this.updateField(this.$county, address.county);
    }
    if (this.populateOrganisation === true) {
      this.updateField(this.$organisation, address.organisation_name);
    }
  };

  // Update field and also trigger a change event
  // Otherwise magento won't know the field has been updated
  IdpcBinding.prototype.updateField = function(field, value) {
    var $field = field.call(this);
    $field.val(value);
    $field.trigger("change");
  };

  IdpcBinding.prototype.handleError = function(error) {};

  IdpcBinding.prototype.applyAutocomplete = function() {
    if (this.addressAutocomplete !== true) return;

    var self = this;

    controller = new IdealPostcodes.Autocomplete.Controller({
      api_key: self.api_key,
      checkKey: true,
      onLoaded: function() {
        self._autocompleteInstances.push(controller);
        self.detectCountry(); // Check if correct country is engaged
      },
      inputField: "#" + self.$lineOne().attr("id"),
      onAddressRetrieved: self.handleAddressSelection.bind(self),
      onSearchError: self.handleError.bind(self)
    });
  };

  IdpcBinding.prototype.applyPostcodeLookup = function() {
    var self = this;
    var $ = this.$;

    if (this.postcodeLookup !== true) return;

    var $linesContainer = this.$linesContainer();
    if ($linesContainer.length === 0) return;

    // Instantiate lookup container and insert to DOM
    var lookupContainer = $(
      '<div class="idpc_lookup field" id="idpc_postcode_lookup">'
    ).insertBefore($linesContainer);

    // Insert postode lookup
    var $instance = lookupContainer.setupPostcodeLookup({
      api_key: self.api_key,
      check_key: true,
      onLoaded: function() {
        // Add search label
        $instance.prepend(
          $(
            '<label class="label" for="idpc_postcode_lookup"><span>Search your Postcode</span></label>'
          )
        );
        self._postcodeLookupInstances.push($instance);
        self.detectCountry(); // Check if correct country is engaged

      },
      onAddressSelected: self.handleAddressSelection.bind(self),
      onSearchError: self.handleError.bind(self)
    });
  };

  /**
   * Bind Ideal Postcodes to address fields that appear now (or maybe later) in a specific form
   */
  IdpcBinding.prototype.watch = function(options) {
    var self = this;
    this._interval = setInterval(function() {
      self.load();
    }, 1000);
  };

  /**
   * Hide all postcode lookup and autocomplete functionality
   */
  IdpcBinding.prototype.hideAll = function() {
    this._autocompleteInstances.forEach(function(instance) {
      var interface = instance.interface;
      var input = interface.input;

      // Disable current autocomplet activity just in case
      interface._onBlurBound();

      // Detact listeners
      input.removeEventListener("input", interface._onInputBound);
      input.removeEventListener("blur", interface._onBlurBound);
      input.removeEventListener("focus", interface._onFocusBound);
      input.removeEventListener("keydown", interface._onKeyDownBound);
      interface.suggestionList.removeEventListener(
        "mousedown",
        interface._onMousedownBound
      );
    });
    this._postcodeLookupInstances.forEach(function($instance) {
      $instance.hide();
    });
  };

  var NOOP = function() {};

  IdpcBinding.prototype.showAll = function() {
    this._autocompleteInstances.forEach(function(instance) {
      instance.interface.initialiseEventListeners();
    });
    this._postcodeLookupInstances.forEach(function($instance) {
      $instance.show();
    });
  };

  // Returns true if current country is supported
  IdpcBinding.prototype.countrySupported = function() {
    var currentCountry = IdpcBinding.toName[this.$country().val()];
    return currentCountry !== undefined;
  };

  IdpcBinding.prototype.detectCountry = function() {
    if (this.countrySupported()) {
      return this.showAll();
    } else {
      return this.hideAll();
    }
  };

  // Mapping of ISO country codes to name
  IdpcBinding.toName = {
    GB: "United Kingdom",
    JE: "Jersey",
    IM: "Isle of Man",
    GG: "Guernsey"
  };

  // Mapping of countries to ISO country codes
  IdpcBinding.toIso = {
    "united kingdom": "GB",
    england: "GB",
    scotland: "GB",
    wales: "GB",
    "northern ireland": "GB",
    jersey: "JE",
    "isle of man": "IM",
    guernsey: "GG"
  };

  window.IdpcBinding = IdpcBinding;
})(window);
