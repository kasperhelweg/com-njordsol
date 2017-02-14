jQuery(document).ready(function($) {

	var mediaUploader = null;

	$('#kmspc-add-image').click(function(evt) {

		mediaUploader = wp.media({
            multiple: false
        });

		mediaUploader.on('select', function() {

			$('#kmspc-image-url').val(mediaUploader.state().get('selection').toJSON()[0].url);

			mediaUploader = null;
        });

        mediaUploader.open();

		evt.preventDefault();

	});

	var $modalWrapper = $('#fpd-modal-edit-options'),
		$paramsInput = $('#kmspc-fpd-params'),
		$thumbnailInput = $('#kmspc-fpd-thumbnail');

	$('#kmspc-set-fpd-params').click(function(evt) {

		$modalWrapper.parent().css('display', 'block');
		fpdSetDesignFormFields($paramsInput, $thumbnailInput);

		evt.preventDefault();

	});

	//save and close modal
	$modalWrapper.on('click', '.fpd-save-modal', function(evt) {

		$thumbnailInput.val($('#fpd-design-thumbnail').attr('src'));
		$paramsInput.val($modalWrapper.find('form').serialize().replace(/[^&]+=&/g, '').replace(/&[^&]+=$/g, ''));

		closeModal($modalWrapper);

		evt.preventDefault();

	})
	.on('click', '.fpd-close-modal', function(evt) {

		closeModal($modalWrapper);

		evt.preventDefault();

	});

});
