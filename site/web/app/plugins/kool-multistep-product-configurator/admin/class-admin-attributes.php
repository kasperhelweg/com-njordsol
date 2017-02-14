<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly

/*
* Class to add additional fields to the attributes admin page
*
*/

if( !class_exists('KMSPC_Admin_Attributes') ) {

	class KMSPC_Admin_Attributes {


		public function __construct() {

			if( function_exists('wc_get_attribute_taxonomy_names') ) {

				$attributes = wc_get_attribute_taxonomy_names();

				foreach( $attributes as $attribute ) {

					add_action( $attribute.'_add_form_fields', array( $this, 'add_image_uploader_to_add_form'), 10, 2 );
					add_action( $attribute.'_edit_form_fields', array( $this, 'add_image_uploader_to_edit_form'), 10, 1);
					add_action( 'edited_'.$attribute, array( $this, 'save_taxonomy_custom_meta'), 10, 2 );
					add_action( 'create_'.$attribute, array( $this, 'save_taxonomy_custom_meta'), 10, 2 );
					add_action( 'delete_'.$attribute, array( $this, 'delete_taxonomy_custom_meta'), 10, 2 );
					add_action( 'admin_footer-edit-tags.php', array( $this, 'add_fpd_params_modal') );

				}

			}

		}

		//add image uploader to add-attribute form
		public function add_image_uploader_to_add_form( ) {

			?>
			<div class="form-field">
				<label for="kmspc_image_url"><?php _e('Image URL', 'radykal') ?></label>
				<div class="kmspc-upload-field">
					<input name="kmspc_image_url" id="kmspc-image-url" type="text" value="" />
					<a href="#" class="button" id="kmspc-add-image"><?php _e('Add from media library', 'radykal'); ?></a>
				</div>
				<p class="description"><?php printf( __('This image will be used as attribute thumbnail for the Multistep Product Configurator. The <a href="%s">"Single Product Image"</a> size will be used as size for this thumbnail.', 'radykal'), esc_url( admin_url('admin.php?page=wc-settings&tab=products#shop_single_image_size-width') ) ); ?></p>
			</div>

			<?php if(class_exists('Fancy_Product_Designer') && version_compare(Fancy_Product_Designer::VERSION, '1.2.0', '>')) : ?>
			<div class="form-field">
				<label><?php _e('Fancy Product Designer Options', 'radykal'); ?></label>
				<div>
					<a href="#" class="button" id="kmspc-set-fpd-params"><?php _e('Set Options', 'radykal'); ?></a>
					<input type="hidden" id="kmspc-fpd-params" name="kmspc_fpd_params" value="" />
					<input type="hidden" id="kmspc-fpd-thumbnail" name="kmspc_fpd_thumbnail" value="" />
					<p class="description"><?php _e('Fancy Product Designer is enabled. This allows you to set element options for your attributes. If you select an attribute with enabled options, it will add the image to the product stage.', 'radykal'); ?></p>
				</div>
			</div>
			<?php
			endif;

		}

		//add image uploader to edit-attribute form
		public function add_image_uploader_to_edit_form( $term ) {

			$term_id = $term->term_id;
			$image_url = get_option( 'kmspc_variation_image_'.$term_id );
			$fpd_params = get_option( 'kmspc_variation_fpd_params_'.$term_id );
			$fpd_thumbnail = get_option( 'kmspc_variation_fpd_thumbnail_'.$term_id );

			?>
			<tr class="form-field">
				<th scope="row" valign="top">
					<label for="kmspc_image_url"><?php _e('Image URL', 'radykal') ?></label>
				</th>
				<td>
					<input name="kmspc_image_url" id="kmspc-image-url" type="text" value="<?php echo $image_url; ?>" />
					<a href="#" class="button" id="kmspc-add-image"><?php _e('Add from media library', 'radykal'); ?></a>
					<p class="description"><?php printf( __('This image will be used as attribute thumbnail for the Multistep Product Configurator. The <a href="%s">"Single Product Image"</a> size will be used as size for this thumbnail.', 'radykal'), esc_url( admin_url('admin.php?page=wc-settings&tab=products#shop_single_image_size-width') ) ); ?></p>
				</td>
			</tr>

			<?php if(class_exists('Fancy_Product_Designer') && version_compare(Fancy_Product_Designer::VERSION, '1.2.0', '>')) : ?>
			<tr class="form-field">
				<th scope="row" valign="top">
					<label><?php _e('Fancy Product Designer Options', 'radykal'); ?></label>
				</th>
				<td>
					<a href="#" class="button" id="kmspc-set-fpd-params"><?php _e('Set Options', 'radykal'); ?></a>
					<input type="hidden" id="kmspc-fpd-params" name="kmspc_fpd_params" value="<?php echo $fpd_params; ?>" />
					<input type="text" id="kmspc-fpd-thumbnail" name="kmspc_fpd_thumbnail" value="<?php echo $fpd_thumbnail; ?>" />
					<p class="description"><?php _e('Fancy Product Designer is enabled. This allows you to set element options for your attributes. If you select an attribute with enabled options, it will add the image to the product stage.', 'radykal'); ?></p>
				</td>
			</tr>
			<?php
			endif;

		}

		public function save_taxonomy_custom_meta( $term_id ) {

			if ( isset( $_POST['kmspc_image_url'] ) )
				update_option( 'kmspc_variation_image_'.$term_id, $_POST['kmspc_image_url'] );

			if ( isset( $_POST['kmspc_fpd_params'] ) )
				update_option( 'kmspc_variation_fpd_params_'.$term_id, $_POST['kmspc_fpd_params'] );

			if ( isset( $_POST['kmspc_fpd_thumbnail'] ) )
				update_option( 'kmspc_variation_fpd_thumbnail_'.$term_id, $_POST['kmspc_fpd_thumbnail'] );

		}

		public function delete_taxonomy_custom_meta( $term_id ) {

			delete_option( 'kmspc_variation_image_'.$term_id );
			delete_option( 'kmspc_variation_fpd_params_'.$term_id );
			delete_option( 'kmspc_variation_fpd_thumbnail_'.$term_id );

		}

		public function add_fpd_params_modal() {

			$screen = get_current_screen();

			if(isset($screen->post_type) && $screen->post_type === 'product' && class_exists('Fancy_Product_Designer') && version_compare(Fancy_Product_Designer::VERSION, '1.2.0', '>')) {

				echo '<div style="display: none;">';
				require_once( FPD_PLUGIN_ADMIN_DIR.'/modals/modal-edit-design-category-options.php' );
				echo '</div>';

			}

		}

	}
}

new KMSPC_Admin_Attributes();
?>