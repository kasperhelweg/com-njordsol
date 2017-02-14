<?php

if( !class_exists('KMSPC_Admin_Product') ) {

	class KMSPC_Admin_Product {

		public function __construct() {

			add_filter( 'product_type_options', array( &$this, 'add_product_type_option' ) );
			add_filter( 'woocommerce_product_data_tabs', array( &$this, 'add_product_data_tab' ) );
			add_action( 'woocommerce_product_data_panels', array( &$this, 'add_product_data_panel' ) );
			add_action( 'woocommerce_process_product_meta', array( &$this, 'save_custom_fields' ), 10, 2 );

		}

		//add checkbox to enable kmspc for a product
		public function add_product_type_option( $types ) {

			$types['kmspc'] = array(
				'id' => '_kmspc',
				'wrapper_class' => 'show_if_kmspc show_if_variable',
				'label' => __( 'Multistep Product Configurator', 'radykal' ),
				'description' => __( 'Enable the multistep product configurator form.', 'radykal' )
			);

			return $types;

		}

		//the tab in the data panel
		public function add_product_data_tab( $tabs ) {

			$tabs['kmspc'] = array(
				'label'  => __( 'KMSPC', 'radykal' ),
				'target' => 'kmspc_data',
				'class'  => array( 'hide_if_kmspc' ),
			);

			return $tabs;

		}

		//custom panel in the product post to set some options
		public function add_product_data_panel() {

			global $wpdb, $post;

			$options = KMSPC_Admin_Settings::get_options();
			$custom_fields = get_post_custom($post->ID);
			$stored_options = array();

			foreach( KMSPC_Admin_Settings::get_options() as $key => $value) {

				$option_key = 'kmspc_'.$key;
				if( isset($custom_fields[$option_key]) ) {
					$stored_options[$key] = $custom_fields[$option_key][0];
				}
				else {
					$stored_options[$key] = '';
				}

			}

			require_once(KMSPC_PLUGIN_ADMIN_DIR.'/views/html-admin-meta-box.php');

		}

		//be sure to save the checkbox value (product post)
		public function save_custom_fields( $post_id, $post ) {

			update_post_meta( $post_id, '_kmspc', isset( $_POST['_kmspc'] ) ? 'yes' : 'no' );

			if( isset($_POST['kmspc_module']) ) {

				foreach( KMSPC_Admin_Settings::get_options() as $key => $value) {

					$option_key = 'kmspc_'.$key;
					if( isset($_POST[$option_key]) ) {

						update_post_meta( $post_id, $option_key, $_POST[$option_key] );

					}
					else {

						update_post_meta( $post_id, $option_key, '' );

					}

				}

			}

		}

	}
}

new KMSPC_Admin_Product();

?>