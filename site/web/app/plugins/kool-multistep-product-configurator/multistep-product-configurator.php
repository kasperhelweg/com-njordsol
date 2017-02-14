<?php
/*
Plugin Name: Kool Multistep Product Configurator
Plugin URI: http://www.gocooldesign.com/
Description: Create a Multistep Product Configurator with the attributes and variations of your products.
Version: 1.0
Author: Samiullah Kaifi
Author URI: http://www.gocooldesign.com/
*/

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly



if (!defined('KMSPC_PLUGIN_DIR'))
    define( 'KMSPC_PLUGIN_DIR', dirname(__FILE__) );

if (!defined('KMSPC_PLUGIN_ROOT_PHP'))
    define( 'KMSPC_PLUGIN_ROOT_PHP', dirname(__FILE__).'/'.basename(__FILE__)  );

if (!defined('KMSPC_PLUGIN_ADMIN_DIR'))
    define( 'KMSPC_PLUGIN_ADMIN_DIR', dirname(__FILE__) . '/admin' );


if( !class_exists('Multistep_Product_Configurator') ) {

	class Multistep_Product_Configurator {

		const VERSION = '1.0.6';
		const CAPABILITY = "edit_kmspc";
		const DEMO = false;

		public function __construct() {

			require_once(KMSPC_PLUGIN_DIR.'/inc/kmspc-functions.php');
			require_once(KMSPC_PLUGIN_ADMIN_DIR.'/class-admin.php');
			require_once(KMSPC_PLUGIN_DIR.'/inc/class-scripts-styles.php');

			add_action( 'init', array( &$this, 'init') );

		}

		public function init() {

			require_once(KMSPC_PLUGIN_DIR.'/inc/class-frontend-product.php');

		}

	}
}

new Multistep_Product_Configurator();

?>