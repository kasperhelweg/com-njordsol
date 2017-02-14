jQuery(document).ready(function($) {

	$('#_kmspc').change(function() {
		if($(this).is(':checked')) {
			$('.hide_if_kmspc').show();
		}
		else {
			$('.hide_if_kmspc').hide();
		}
	}).change();

});