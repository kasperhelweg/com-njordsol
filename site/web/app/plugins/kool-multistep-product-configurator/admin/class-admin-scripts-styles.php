<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


if( !class_exists('KMSPC_Admin_Scripts_Styles') ) {

	class KMSPC_Admin_Scripts_Styles {

		public function __construct() {

			add_action( 'admin_enqueue_scripts', array( &$this, 'enqueue_styles_scripts' ), 50 );

		}

		public function enqueue_styles_scripts( $hook ) {

			global $post;

			$wc_settings_page = 'wc-settings';

			//woocommerce settings
			if( $hook == 'woocommerce_page_'.$wc_settings_page.'' ) {

				wp_enqueue_style( 'kmspc-admin', plugins_url('/css/admin.css', __FILE__) );
				wp_enqueue_script( 'kmspc-admin', plugins_url('/js/admin.js', __FILE__), false, Multistep_Product_Configurator::VERSION );

			}

			//woocommerce post types
		    if ( $hook == 'post-new.php' || $hook == 'post.php' ) {

		    	//product
		        if ( 'product' === $post->post_type ) {

		        	wp_enqueue_style( 'kmspc-admin', plugins_url('/css/admin.css', __FILE__) );
		        	wp_enqueue_script( 'kmspc-meta-box', plugins_url('/js/meta-box.js', __FILE__), false, Multistep_Product_Configurator::VERSION );

		        }
		    }

		    //add attribute form
		    if( ( isset($_GET['page']) && $_GET['page'] == 'product_attributes' ) ) {

				wp_enqueue_media();

				wp_enqueue_style( 'kmspc-admin', plugins_url('/css/admin.css', __FILE__) );
				wp_enqueue_script( 'kmspc-admin', plugins_url('/js/admin.js', __FILE__), false, Multistep_Product_Configurator::VERSION );

				wp_enqueue_style( 'fpd-admin-icon-font' );
				wp_enqueue_style( 'radykal-admin' );
		    	wp_enqueue_style( 'fpd-admin' );
				wp_enqueue_script('fpd-admin');

		    }

			//edit attribute form
		    if( $hook == 'edit-tags.php' ) {

				$attributes = wc_get_attribute_taxonomy_names();
				if( !empty($attributes) && in_array($_GET['taxonomy'], $attributes) ) {

					wp_enqueue_media();

					wp_enqueue_style( 'kmspc-admin', plugins_url('/css/admin.css', __FILE__) );
					wp_enqueue_script( 'kmspc-admin', plugins_url('/js/admin.js', __FILE__), false, Multistep_Product_Configurator::VERSION );

					wp_enqueue_style( 'fpd-admin-icon-font' );
					wp_enqueue_style( 'radykal-admin' );
					wp_enqueue_style( 'fpd-admin' );
					wp_enqueue_script('fpd-admin');

				}

		    }
		}
	}
}

new KMSPC_Admin_Scripts_Styles();

?>