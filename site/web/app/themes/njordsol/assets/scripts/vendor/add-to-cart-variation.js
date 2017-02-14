/*global wc_add_to_cart_variation_params, wc_cart_fragments_params */
;(function ( $, window, document, undefined ) {
	  /**
	   * VariationForm class which handles variation forms and attributes.
	   */
	  var VariationForm = function( $form ) {
		    this.$form                = $form;
		    this.$attributeFields     = $form.find( '.variations select' );
		    this.$singleVariation     = $form.find( '.single_variation' );
		    this.$singleVariationWrap = $form.find( '.single_variation_wrap' );
		    this.$resetVariations     = $form.find( '.reset_variations' );
		    this.$product             = $form.closest( '.product' );
		    this.variationData        = $form.data( 'product_variations' );
		    this.useAjax              = false === this.variationData;
		    this.xhr                  = false;

		    // Initial state.
		    this.$singleVariationWrap.show();
		    this.$form.unbind( 'check_variations update_variation_values found_variation' );
		    this.$resetVariations.unbind( 'click' );
		    this.$attributeFields.unbind( 'change ' );

		    // Methods.
		    this.getChosenAttributes = this.getChosenAttributes.bind( this );
		    this.findMatchingVariations = this.findMatchingVariations.bind( this );
		    this.isMatch = this.isMatch.bind( this );
		    this.toggleResetLink = this.toggleResetLink.bind( this );

		    // Events.

		    $form.on( 'click', '.reset_variations', { variationForm: this }, this.onReset );
		    $form.on( 'reload_product_variations', { variationForm: this }, this.onReload );
		    $form.on( 'hide_variation', { variationForm: this }, this.onHide );
		    $form.on( 'show_variation', { variationForm: this }, this.onShow );
		    $form.on( 'click', 'single_add_to_cart_button', { variationForm: this }, this.onAddToCart );
		    $form.on( 'reset_data', { variationForm: this }, this.onResetDisplayedVariation );
		    $form.on( 'reset_image', { variationForm: this }, this.onResetImage );
        //$form.on( 'change', '.variations select', { variationForm: this }, this.onChange );
		    $form.on( 'change', '.variations select', { variationForm: this }, this.onChangeWrapper );
		    $form.on( 'found_variation', { variationForm: this }, this.onFoundVariation );
		    $form.on( 'check_variations', { variationForm: this }, this.onFindVariation );
		    $form.on( 'update_variation_values', { variationForm: this }, this.onUpdateAttributes );

        //$form.on( 'woocommerce_variation_select_change', { variationForm: this }, this.hSelect );
        //$form.on( 'woocommerce_update_variation_values', { variationForm: this }, this.hSelect2 );

        // IMPLEMENTATION
        //
        this.currentIndex = 0;
        this.lock = false;

        this.$dictOfAttributes        = {};
        this.$dictOfAttributesReverse = {};
        this.$dictOfCurrentOptions    = {};

        for(var i = 0; i < this.$attributeFields.length; i++) {
            this.$dictOfAttributes[this.$attributeFields[i].id] = i;
            this.$dictOfAttributesReverse[i] = this.$attributeFields[i].id;
        }
        ////

		    // Check variations once init.
		    $form.trigger( 'check_variations' );
		    $form.trigger( 'wc_variation_form' );
	  };

    // Before first change
    VariationForm.prototype.onChangeWrapper = function( event ) {
        var form  = event.data.variationForm;

        if(!form.lock) {

            var selectId      = event.currentTarget.id;
            var currentSelect = form.currentIndex = form.$dictOfAttributes[selectId];

            form.lock = true;
        }

        /*
          for(var i = 0; i < form.$attributeFields.length; i++) {
          if($(form.$attributeFields[i]).val() == '19') {
          $(form.$attributeFields[i]).val('');
          }
          }
        */

        // save current values for restore
        // this is needed for top-down contraint
        /*
          form.$dictOfCurrentOptions[selectId] = {
          html: $(form.$attributeFields[form.currentIndex]).html(),
          val: $(form.$attributeFields[form.currentIndex]).val() || ''
          };
        */
        // Propagate event to original handler...
        event.data.variationForm.onChange(event);
    };

    // After first change
	  VariationForm.prototype.hSelect = function( event ) {
        console.log("woocommerce_variation_select_change");

        var form = event.data.variationForm;
        /*

          var index   = form.currentIndex;
          var current = $(form.$attributeFields[index]);
          var next    = $(form.$attributeFields[index + 1]);

          if(!current.val()) {
          if(next.children().eq(1).val() == '19') {
          next.val('');
          }
          }
        */

    };

    // After updated attrs
	  VariationForm.prototype.hSelect2 = function( event ) {
        console.log("woocommerce_variation_select_change_2");

        var form = event.data.variationForm;

        var currentIndex  = form.currentIndex;
        var currentSelect = $(form.$attributeFields[currentIndex]);
        var nextSelect    = $(form.$attributeFields[currentIndex + 1]);

        var h = [];

        if(currentSelect.val()) {
            for(var i = currentIndex; i < form.$attributeFields.length; i++) {
                var c = i;
                var n = c + 1;
                if($(form.$attributeFields[i]).val() && $(form.$attributeFields[c]).children().eq(0).val() == '') {
                    $("table.variations tr:eq(" + (n) + ")").show();
                }
            }
        } else {
            for(var i = currentIndex + 1; i < form.$attributeFields.length; i++) {
                // Select
                var s = $("table.variations tr:eq(" + (i) + ") .value select");

                if(s.is(":visible") && !s.val()) {
                    var tr = "table.variations tr:eq(" + (i) + ")";
                    h.push(tr);
                }
            }

            for(var j in h) {
                $(h[j]).wrapInner('<div style="display: block;" />')
                $(h[j]).find('div').addClass("YO").fadeOut(1000);
            }
        };
    };


	  /**
	   * Reset all fields.
	   */
	  VariationForm.prototype.onReset = function( event ) {
		    event.preventDefault();
		    event.data.variationForm.$attributeFields.val( '' ).change();
		    event.data.variationForm.$form.trigger( 'reset_data' );
	  };

	  /**
	   * Reload variation data from the DOM.
	   */
	  VariationForm.prototype.onReload = function( event ) {
		    var form           = event.data.variationForm;
		    form.variationData = form.$form.data( 'product_variations' );
		    form.useAjax       = false === form.variationData;
		    form.$form.trigger( 'check_variations' );
	  };

	  /**
	   * When a variation is hidden.
	   */
	  VariationForm.prototype.onHide = function( event ) {
		    event.preventDefault();
		    event.data.variationForm.$form.find( '.single_add_to_cart_button' ).removeClass( 'wc-variation-is-unavailable' ).addClass( 'disabled wc-variation-selection-needed' );
		    event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-enabled' ).addClass( 'woocommerce-variation-add-to-cart-disabled' );
	  };

	  /**
	   * When a variation is shown.
	   */
	  VariationForm.prototype.onShow = function( event, variation, purchasable ) {
		    event.preventDefault();
		    if ( purchasable ) {
			      event.data.variationForm.$form.find( '.single_add_to_cart_button' ).removeClass( 'disabled wc-variation-selection-needed wc-variation-is-unavailable' );
			      event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-disabled' ).addClass( 'woocommerce-variation-add-to-cart-enabled' );
		    } else {
			      event.data.variationForm.$form.find( '.single_add_to_cart_button' ).removeClass( 'wc-variation-selection-needed' ).addClass( 'disabled wc-variation-is-unavailable' );
			      event.data.variationForm.$form.find( '.woocommerce-variation-add-to-cart' ).removeClass( 'woocommerce-variation-add-to-cart-enabled' ).addClass( 'woocommerce-variation-add-to-cart-disabled' );
		    }
	  };

	  /**
	   * When the cart button is pressed.
	   */
	  VariationForm.prototype.onAddToCart = function( event ) {
		    if ( $( this ).is('.disabled') ) {
			      event.preventDefault();

			      if ( $( this ).is('.wc-variation-is-unavailable') ) {
				        window.alert( wc_add_to_cart_variation_params.i18n_unavailable_text );
			      } else if ( $( this ).is('.wc-variation-selection-needed') ) {
				        window.alert( wc_add_to_cart_variation_params.i18n_make_a_selection_text );
			      }
		    }
	  };

	  /**
	   * When displayed variation data is reset.
	   */
	  VariationForm.prototype.onResetDisplayedVariation = function( event ) {
        console.log("RESET");
		    var form = event.data.variationForm;
		    form.$product.find( '.product_meta' ).find( '.sku' ).wc_reset_content();
		    form.$product.find( '.product_weight' ).wc_reset_content();
		    form.$product.find( '.product_dimensions' ).wc_reset_content();
		    form.$form.trigger( 'reset_image' );
		    form.$singleVariation.slideUp( 200 ).trigger( 'hide_variation' );
	  };

	  /**
	   * When the product image is reset.
	   */
	  VariationForm.prototype.onResetImage = function( event ) {
		    event.data.variationForm.$form.wc_variations_image_update( false );
	  };

	  /**
	   * Looks for matching variations for current selected attributes.
	   */
	  VariationForm.prototype.onFindVariation = function( event ) {
        console.log("BEFORE SECOND");
		    var form = event.data.variationForm;

		    if ( form.useAjax ) {
			      return;
		    }

		    form.$form.trigger( 'update_variation_values' );
        console.log("AFTER SECOND");

		    var attributes          = form.getChosenAttributes(),
			  matching_variations = form.findMatchingVariations( form.variationData, attributes.data );

		    if ( attributes.count === attributes.chosenCount ) {
            console.log("COUNT MATCHES");
			      var variation = matching_variations.shift();

			      if ( variation ) {
                console.log("VARIATION FOUND");
				        form.$form.trigger( 'found_variation', [ variation ] );
			      } else {
				        window.alert( wc_add_to_cart_variation_params.i18n_no_matching_variations_text );
				        form.$form.trigger( 'reset_data' );
			      }
		    } else {
			      form.$form.trigger( 'reset_data' );
			      form.$singleVariation.slideUp( 200 ).trigger( 'hide_variation' );
            console.log("NO VARIATION");
		    }

		    // added to get around variation image flicker issue
		    $( '.product.has-default-attributes > .images' ).fadeTo( 200, 1 );

		    form.toggleResetLink( attributes.chosenCount > 0 );
	  };

	  /**
	   * Triggered when a variation has been found which matches all attributes.
	   */
	  VariationForm.prototype.onFoundVariation = function( event, variation ) {
        console.log("FOUND A VARIATION!");
		    var form           = event.data.variationForm,
			  $sku           = form.$product.find( '.product_meta' ).find( '.sku' ),
			  $weight        = form.$product.find( '.product_weight' ),
			  $dimensions    = form.$product.find( '.product_dimensions' ),
			  $qty           = form.$singleVariationWrap.find( '.quantity' ),
			  purchasable    = true,
			  variation_id   = '',
			  template       = false,
			  $template_html = '';

		    if ( variation.sku ) {
			      $sku.wc_set_content( variation.sku );
		    } else {
			      $sku.wc_reset_content();
		    }

		    if ( variation.weight ) {
			      $weight.wc_set_content( variation.weight );
		    } else {
			      $weight.wc_reset_content();
		    }

		    if ( variation.dimensions ) {
			      $dimensions.wc_set_content( variation.dimensions );
		    } else {
			      $dimensions.wc_reset_content();
		    }

		    form.$form.wc_variations_image_update( variation );

		    if ( ! variation.variation_is_visible ) {
			      template = wp.template( 'unavailable-variation-template' );
		    } else {
			      template     = wp.template( 'variation-template' );
			      variation_id = variation.variation_id;
		    }

		    $template_html = template( {
			      variation: variation
		    } );
		    $template_html = $template_html.replace( '/*<![CDATA[*/', '' );
		    $template_html = $template_html.replace( '/*]]>*/', '' );

		    form.$singleVariation.html( $template_html );
		    form.$form.find( 'input[name="variation_id"], input.variation_id' ).val( variation.variation_id ).change();

		    // Hide or show qty input
		    if ( variation.is_sold_individually === 'yes' ) {
			      $qty.find( 'input.qty' ).val( '1' ).attr( 'min', '1' ).attr( 'max', '' );
			      $qty.hide();
		    } else {
			      $qty.find( 'input.qty' ).attr( 'min', variation.min_qty ).attr( 'max', variation.max_qty );
			      $qty.show();
		    }

		    // Enable or disable the add to cart button
		    if ( ! variation.is_purchasable || ! variation.is_in_stock || ! variation.variation_is_visible ) {
			      purchasable = false;
		    }

		    // Reveal
		    if ( $.trim( form.$singleVariation.text() ) ) {
			      form.$singleVariation.slideDown( 200 ).trigger( 'show_variation', [ variation, purchasable ] );
		    } else {
			      form.$singleVariation.show().trigger( 'show_variation', [ variation, purchasable ] );
		    }
	  };

	  /**
	   * Triggered when an attribute field changes.
	   */
	  VariationForm.prototype.onChange = function( event ) {
        console.log("FIRST");


		    var form = event.data.variationForm;

		    form.$form.find( 'input[name="variation_id"], input.variation_id' ).val( '' ).change();
		    form.$form.find( '.wc-no-matching-variations' ).remove();

		    if ( form.useAjax ) {
			      if ( form.xhr ) {
				        form.xhr.abort();
			      }
			      var attributes = form.getChosenAttributes(),
				    data       = attributes.data;

			      if ( attributes.count === attributes.chosenCount ) {
				        form.$form.block( { message: null, overlayCSS: { background: '#fff', opacity: 0.6 } } );
				        data.product_id  = parseInt( form.$form.data( 'product_id' ), 10 );
				        data.custom_data = form.$form.data( 'custom_data' );
				        form.xhr         = $.ajax( {
					          url: wc_cart_fragments_params.wc_ajax_url.toString().replace( '%%endpoint%%', 'get_variation' ),
					          type: 'POST',
					          data: data,
					          success: function( variation ) {
						            if ( variation ) {
							              form.$form.trigger( 'found_variation', [ variation ] );
						            } else {
							              form.$form.trigger( 'reset_data' );
							              form.$form.find( '.single_variation' ).after( '<p class="wc-no-matching-variations woocommerce-info">' + wc_add_to_cart_variation_params.i18n_no_matching_variations_text + '</p>' );
							              form.$form.find( '.wc-no-matching-variations' ).slideDown( 200 );
						            }
					          },
					          complete: function() {
						            form.$form.unblock();
					          }
				        } );
			      } else {
				        form.$form.trigger( 'reset_data' );
			      }
			      form.toggleResetLink( attributes.chosenCount > 0 );
		    } else {
			      form.$form.trigger( 'woocommerce_variation_select_change' );
			      form.$form.trigger( 'check_variations' );
			      $( this ).blur();
		    }

		    // added to get around variation image flicker issue
		    $( '.product.has-default-attributes > .images' ).fadeTo( 200, 1 );

		    // Custom event for when variation selection has been changed
		    form.$form.trigger( 'woocommerce_variation_has_changed' );
	  };

	  /**
	   * Escape quotes in a string.
	   * @param {string} string
	   * @return {string}
	   */
	  VariationForm.prototype.addSlashes = function( string ) {
		    string = string.replace( /'/g, '\\\'' );
		    string = string.replace( /"/g, '\\\"' );
		    return string;
	  };

	  /**
	   * Updates attributes in the DOM to show valid values.
	   */
	  VariationForm.prototype.onUpdateAttributes = function( event ) {
        console.log("SECOND");
		    var form              = event.data.variationForm,
			      attributes        = form.getChosenAttributes(),
			      currentAttributes = attributes.data;

        console.log("CURRENT");
        console.log(currentAttributes);
		    if ( form.useAjax ) {
			      return;
		    }
		    // Loop through selects and disable/enable options based on selections.
		    form.$attributeFields.each( function( index, el ) {
            console.log(index);
            console.log(form.currentIndex);

            if(index <= form.currentIndex) {
                return;
            }

			      var current_attr_select = $( el ),
				    current_attr_name       = current_attr_select.data( 'attribute_name' ) || current_attr_select.attr( 'name' ),
				    show_option_none        = $( el ).data( 'show_option_none' ),
				    option_gt_filter        = ':gt(0)',
				    attached_options_count  = 0,
				    new_attr_select         = $( '<select/>' ),
				    selected_attr_val       = current_attr_select.val() || '',
				    selected_attr_val_valid = true;

			      // Reference options set at first.
			      if ( ! current_attr_select.data( 'attribute_html' ) ) {
                console.log("WHAT");
				        var refSelect = current_attr_select.clone();

				        refSelect.find( 'option' ).removeAttr( 'disabled attached' ).removeAttr( 'selected' );

				        current_attr_select.data( 'attribute_options', refSelect.find( 'option' + option_gt_filter ).get() ); // Legacy data attribute.
				        current_attr_select.data( 'attribute_html', refSelect.html() );
			      }

			      new_attr_select.html( current_attr_select.data( 'attribute_html' ) );

			      // The attribute of this select field should not be taken into account when calculating its matching variations:
			      // The constraints of this attribute are shaped by the values of the other attributes.
			      var checkAttributes = $.extend( true, {}, currentAttributes );
			      checkAttributes[ current_attr_name ] = '';
            console.log("CHECK");
            console.log(checkAttributes);
			      var variations = form.findMatchingVariations( form.variationData, checkAttributes );
            console.log(variations)
            if(variations.length > 0) {
			          // Loop through variations.
			          for ( var num in variations ) {
				            if ( typeof( variations[ num ] ) !== 'undefined' ) {
					              var variationAttributes = variations[ num ].attributes;

                        for ( var attr_name in variationAttributes ) {
						                if ( variationAttributes.hasOwnProperty( attr_name ) ) {
							                  var attr_val         = variationAttributes[ attr_name ],
								                variation_active = '';
                                console.log(attr_val); // current val in variations list
                                console.log(attr_name); // current in variation list
                                console.log(current_attr_name); // current select to check
							                  if ( attr_name === current_attr_name ) {
								                    if ( variations[ num ].variation_is_active ) {
									                      variation_active = 'enabled';
								                    }

								                    if ( attr_val ) {
									                      // Decode entities and add slashes.
									                      attr_val = $( '<div/>' ).html( attr_val ).text();

									                      // Attach.
									                      new_attr_select.find( 'option[value="' + form.addSlashes( attr_val ) + '"]' ).addClass( 'attached ' + variation_active );
								                    } else {
									                      // Attach all apart from placeholder.
									                      new_attr_select.find( 'option:gt(0)' ).addClass( 'attached ' + variation_active );
								                    }
							                  }
						                }
					              }
				            }
			          }

			          // Count available options.
			          attached_options_count = new_attr_select.find( 'option.attached' ).length;

			          // Check if current selection is in attached options.
			          if ( selected_attr_val && ( attached_options_count === 0 || new_attr_select.find( 'option.attached.enabled[value="' + form.addSlashes( selected_attr_val ) + '"]' ).length === 0 ) ) {
				            selected_attr_val_valid = false;
			          }

			          // Detach the placeholder if:
			          // - Valid options exist.
			          // - The current selection is non-empty.
			          // - The current selection is valid.
			          // - Placeholders are not set to be permanently visible.
			          if ( attached_options_count > 0 && selected_attr_val && selected_attr_val_valid && ( 'no' === show_option_none ) ) {
				            new_attr_select.find( 'option:first' ).remove();
				            option_gt_filter = '';
			          }

			          // Detach unattached.
			          new_attr_select.find( 'option' + option_gt_filter + ':not(.attached)' ).remove();

			          // Finally, copy to DOM and set value.
                console.log(current_attr_select.html());
                console.log(new_attr_select.html());

			          current_attr_select.html( new_attr_select.html() );
			          current_attr_select.find( 'option' + option_gt_filter + ':not(.enabled)' ).prop( 'disabled', true );

			          // Choose selected.
			          if ( selected_attr_val ) {
				            // If the previously selected value is no longer available, fall back to the placeholder (it's going to be there).
				            if ( selected_attr_val_valid ) {
					              current_attr_select.val( selected_attr_val );
				            } else {
					              current_attr_select.val( '' ).change();
				            }
			          }
            } else {
                //current_attr_select.val('');
            }
		    });
		    // Custom event for when variations have been updated.

        form.lock = false;
		    form.$form.trigger( 'woocommerce_update_variation_values' );
	  };

	  /**
	   * Get chosen attributes from form.
	   * @return array
	   */
	  VariationForm.prototype.getChosenAttributes = function() {
		    var data   = {};
		    var count  = 0;
		    var chosen = 0;

		    this.$attributeFields.each( function() {
			      var attribute_name = $( this ).data( 'attribute_name' ) || $( this ).attr( 'name' );
			      var value          = $( this ).val() || '';

			      if ( value.length > 0 ) {
				        chosen ++;
			      }

			      count ++;
			      data[ attribute_name ] = value;
		    });

		    return {
			      'count'      : count,
			      'chosenCount': chosen,
			      'data'       : data
		    };
	  };

	  /**
	   * Find matching variations for attributes.
	   */
	  VariationForm.prototype.findMatchingVariations = function( variations, attributes ) {
		    var matching = [];
		    for ( var i = 0; i < variations.length; i++ ) {
			      var variation = variations[i];

			      if ( this.isMatch( variation.attributes, attributes ) ) {
				        matching.push( variation );
			      }
		    }
		    return matching;
	  };

	  /**
	   * See if attributes match.
	   * @return {Boolean}
	   */
	  VariationForm.prototype.isMatch = function( variation_attributes, attributes ) {
		    var match = true;
		    for ( var attr_name in variation_attributes ) {
			      if ( variation_attributes.hasOwnProperty( attr_name ) ) {
				        var val1 = variation_attributes[ attr_name ];
				        var val2 = attributes[ attr_name ];
				        if ( val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2 ) {
					          match = false;
				        }
			      }
		    }
		    return match;
	  };

	  /**
	   * Show or hide the reset link.
	   */
	  VariationForm.prototype.toggleResetLink = function( on ) {
		    if ( on ) {
			      if ( this.$resetVariations.css( 'visibility' ) === 'hidden' ) {
				        this.$resetVariations.css( 'visibility', 'visible' ).hide().fadeIn();
			      }
		    } else {
			      this.$resetVariations.css( 'visibility', 'hidden' );
		    }
	  };

	  /**
	   * Function to call wc_variation_form on jquery selector.
	   */
	  $.fn.wc_variation_form = function() {
		    new VariationForm( this );
		    return this;
	  };

	  /**
	   * Stores the default text for an element so it can be reset later
	   */
	  $.fn.wc_set_content = function( content ) {
		    if ( undefined === this.attr( 'data-o_content' ) ) {
			      this.attr( 'data-o_content', this.text() );
		    }
		    this.text( content );
	  };

	  /**
	   * Stores the default text for an element so it can be reset later
	   */
	  $.fn.wc_reset_content = function() {
		    if ( undefined !== this.attr( 'data-o_content' ) ) {
			      this.text( this.attr( 'data-o_content' ) );
		    }
	  };

	  /**
	   * Stores a default attribute for an element so it can be reset later
	   */
	  $.fn.wc_set_variation_attr = function( attr, value ) {
		    if ( undefined === this.attr( 'data-o_' + attr ) ) {
			      this.attr( 'data-o_' + attr, ( ! this.attr( attr ) ) ? '' : this.attr( attr ) );
		    }
		    this.attr( attr, value );
	  };

	  /**
	   * Reset a default attribute for an element so it can be reset later
	   */
	  $.fn.wc_reset_variation_attr = function( attr ) {
		    if ( undefined !== this.attr( 'data-o_' + attr ) ) {
			      this.attr( attr, this.attr( 'data-o_' + attr ) );
		    }
	  };

	  /**
	   * Sets product images for the chosen variation
	   */
	  $.fn.wc_variations_image_update = function( variation ) {
		    var $form             = this,
			  $product          = $form.closest('.product'),
			  $product_img      = $product.find( 'div.images img:eq(0)' ),
			  $product_link     = $product.find( 'div.images a.zoom:eq(0)' );

		    if ( variation && variation.image_src && variation.image_src.length > 1 ) {
			      $product_img.wc_set_variation_attr( 'src', variation.image_src );
			      $product_img.wc_set_variation_attr( 'title', variation.image_title );
			      $product_img.wc_set_variation_attr( 'alt', variation.image_alt );
			      $product_img.wc_set_variation_attr( 'srcset', variation.image_srcset );
			      $product_img.wc_set_variation_attr( 'sizes', variation.image_sizes );
			      $product_link.wc_set_variation_attr( 'href', variation.image_link );
			      $product_link.wc_set_variation_attr( 'title', variation.image_caption );
		    } else {
			      $product_img.wc_reset_variation_attr( 'src' );
			      $product_img.wc_reset_variation_attr( 'title' );
			      $product_img.wc_reset_variation_attr( 'alt' );
			      $product_img.wc_reset_variation_attr( 'srcset' );
			      $product_img.wc_reset_variation_attr( 'sizes' );
			      $product_link.wc_reset_variation_attr( 'href' );
			      $product_link.wc_reset_variation_attr( 'title' );
		    }
	  };

    $.fn.reverse = [].reverse;

	  $(function() {
		    if ( typeof wc_add_to_cart_variation_params !== 'undefined' ) {
			      $( '.variations_form' ).each( function() {
				        $( this ).wc_variation_form();
			      });
		    }
	  });

	  /**
	   * Matches inline variation objects to chosen attributes
	   * @deprecated 2.6.9
	   * @type {Object}
	   */
	  var wc_variation_form_matcher = {
		    find_matching_variations: function( product_variations, settings ) {
			      var matching = [];
			      for ( var i = 0; i < product_variations.length; i++ ) {
				        var variation    = product_variations[i];

				        if ( wc_variation_form_matcher.variations_match( variation.attributes, settings ) ) {
					          matching.push( variation );
				        }
			      }
			      return matching;
		    },
		    variations_match: function( attrs1, attrs2 ) {
			      var match = true;
			      for ( var attr_name in attrs1 ) {
				        if ( attrs1.hasOwnProperty( attr_name ) ) {
					          var val1 = attrs1[ attr_name ];
					          var val2 = attrs2[ attr_name ];
					          if ( val1 !== undefined && val2 !== undefined && val1.length !== 0 && val2.length !== 0 && val1 !== val2 ) {
						            match = false;
					          }
				        }
			      }
			      return match;
		    }
	  };

})( jQuery, window, document );
