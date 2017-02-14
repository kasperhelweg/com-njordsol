<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


if( !class_exists('KMSPC_Scripts_Styles') ) {

	class KMSPC_Scripts_Styles {

		public static $add_script = false;

		public function __construct() {

			add_action( 'wp_enqueue_scripts',array( &$this,'enqueue_styles' ) );
			add_action( 'wp_footer', array(&$this, 'footer_handler') );

		}

		//includes scripts and styles in the frontend
		public function enqueue_styles() {

			global $post;

			//only enqueue css and js files when necessary
			if( kmspc_enabled($post->ID) ) {

				wp_enqueue_style( 'semantic-ui', plugins_url('/semantic/css/semantic.min.css', KMSPC_PLUGIN_ROOT_PHP), false, '0.19.0' );
				wp_enqueue_style( 'kmspc', plugins_url('/css/multistep-product-configurator.css', KMSPC_PLUGIN_ROOT_PHP), false, Multistep_Product_Configurator::VERSION );

			}

		}

		public function footer_handler() {

			if( self::$add_script ) {

				wp_enqueue_script( 'kmspc', plugins_url('/js/multistep-product-configurator.min.js', KMSPC_PLUGIN_ROOT_PHP), array('jquery'), Multistep_Product_Configurator::VERSION );

			}

		}

	}

}

new KMSPC_Scripts_Styles();
?>