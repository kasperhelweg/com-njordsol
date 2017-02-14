jQuery(document).ready(function() {

	var $wrapper = jQuery('.kmspc-wrapper'),
		$menuItems = $wrapper.find('.kmspc-menu-item'),
		$content = $wrapper.find('.kmspc-content'),
		$variationItems = jQuery('.kmspc-variation'),
		$variationForm = jQuery('.variations_form'),
		$selectVariations = $variationForm.find('.variations select'),
		initialVariations = [];

	jQuery('.kmspc-clear-selection').click(function(evt) {

		$variationItems.removeClass('active').show().find('input[type="radio"]').prop('checked', false);
		$variationForm.find('.reset_variations').click();
		$menuItems.removeClass('active').first().removeClass('disabled').click().addClass('active');

		_menuItemsState();

		evt.preventDefault();

	});

	jQuery('.fpd-container').on('productCreate', function() {

		if(document.URL.search('cart_item_key') == -1) {
			for(var i=0; i < initialVariations.length; ++i) {
				_addElementToFpd(initialVariations[i]);
			}
		}
		initialVariations = 'fpd-ready';

	});

	//variation gets selected
	$variationItems.click(function() {

		var $this = jQuery(this);

		$this.parents('.kmspc-variations').find('.kmspc-variation').removeClass('active');
		$this.addClass('active').find('input[type="radio"]').prop('checked', true).change();

		if(initialVariations === 'fpd-ready') {
			_addElementToFpd($this);
		}

	});

	//set and get default variations
	$selectVariations.each(function(i, item) {

		var initialVariation = jQuery('input[name="'+this.id+'"]')
		.filter('[value="'+jQuery(this).val()+'"]')
		.parents('.kmspc-variation');

		//store initial variation
		if(initialVariation.size()) {
			initialVariations.push(initialVariation);
		}

		//loop trough all set default variations and click each
		if(i == $selectVariations.size()-1) {

			for(var j=0; j < initialVariations.length; j++) {
				initialVariations[j].click();
			}
		}

	});


	//radio changed, update select boxes
	$content.find('input[type="radio"]').change(function() {

		var selectIndex = jQuery('.kmspc-variations').index(jQuery(this).parents('.kmspc-variations'));
			$selectBox = $selectVariations.eq(selectIndex);

		//set select value
		$selectBox.focusin().val(this.value).change();

		_menuItemsState();

		//go to next tab if wished
		if($wrapper.hasClass('kmspc-auto-next')) {
			jQuery('.kmspc-menu-item.active').nextAll('.kmspc-menu-item:first').click();
		}


	});

	$menuItems.click(function(evt) {

		var $this = jQuery(this),
			selectId = $this.data('target').replace('.kmspc-', ''),
			$select = jQuery('select#'+selectId+'').focusin();

		if($this.hasClass('disabled')) {
			return false;
		}

		//hide all variation items
		if($select.children('option.active,option.enabled').size() > 0)  {
			$variationItems.find('input[type="radio"]')
			.filter('[name="'+selectId+'"]')
			.parents('.kmspc-variation').hide();
		}

		//loop through all active option and show corresponding variation item
		$select.children('option.active,option.enabled').each(function(i, option) {

			var $option = jQuery(option),
				selectId = $option.parent('select').attr('id');

			$variationItems.find('input[type="radio"]') //all radio buttons in variations
			.filter('[name="'+selectId+'"]') //filter by name
			.filter('[value="'+option.value+'"]') //filter by value
			.parents('.kmspc-variation:first').show() //show variation


		});

		if($wrapper.find('.kmspc-accordion').size() > 0) {

			//accordion
			if( !$this.hasClass('active') ) {

				$menuItems.children('.icon').removeClass('minus').addClass('add');
				$this.children('.icon').removeClass('add').addClass('minus');

				var time = 300;
				$content.slideUp(time);
				$this.next('.kmspc-content:first').delay(time).slideDown(time);

			}

		}
		else {

			//steps, tabs
			$content.find('.kmspc-variations').hide();
			jQuery($this.data('target')).show();

		}

		$menuItems.removeClass('active');
		$this.addClass('active');


		evt.preventDefault();

	});

	//delay to update select boxes
	setTimeout(function() {
		$menuItems.first().click();
	}, 1);

	function _menuItemsState() {

		if($wrapper.hasClass('kmspc-step-by-step')) {

			$menuItems.filter(':not(.active,:first)').addClass('disabled');

			$selectVariations.each(function(i, item) {

				if(this.value && this.value != '') {

					$menuItems.filter('[data-target=".kmspc-'+this.id+'"]')
					.nextAll('.kmspc-menu-item:first').removeClass('disabled');

				}

			});

		}

	}


	//fancy product designer

	function _addElementToFpd(variation) {

		$variation = jQuery(variation);
		if(fancyProductDesigner) {
			if($variation.data('parameters') && typeof $variation.data('parameters') === 'object' && $variation.data('image')) {
				fancyProductDesigner.addElement(
					'image',
					$variation.data('image'), //image source
					$variation.find('.kmspc-attribute-title').text(), //title
					$variation.data('parameters') //parameters
				);
			}

		}

	}

	$menuItems.first().click().addClass('active');

	_menuItemsState();

});