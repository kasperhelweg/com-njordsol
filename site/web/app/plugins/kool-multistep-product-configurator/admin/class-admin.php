<?php

if ( ! defined( 'ABSPATH' ) ) exit; // Exit if accessed directly


if( !class_exists('KMSPC_Admin') ) {

	class KMSPC_Admin {

		public static $ajax_nonce;

		public function __construct() {

			require_once(KMSPC_PLUGIN_ADMIN_DIR . '/class-admin-scripts-styles.php' );
			require_once(KMSPC_PLUGIN_ADMIN_DIR.'/class-admin-settings.php');
			add_action( 'admin_init', array( &$this, 'init_admin' ) );
			add_action( 'admin_notices',  array( &$this, 'display_admin_notices' ) );

		}

		public function init_admin() {

			if( array_key_exists('woocommerce', $GLOBALS) == false) {
				return;
			}

			self::$ajax_nonce = wp_create_nonce( 'kmspc_ajax_nonce' );

			//add capability to administrator
			$role = get_role( 'administrator' );
			$role->add_cap( Multistep_Product_Configurator::CAPABILITY );

			require_once(KMSPC_PLUGIN_ADMIN_DIR . '/class-admin-attributes.php' );
			require_once(KMSPC_PLUGIN_ADMIN_DIR . '/class-admin-product.php' );

		}

		public function display_admin_notices() {

			global $woocommerce;

			if( !function_exists('get_woocommerce_currency') ): ?>
		    <div class="error">
		        <p><?php _e( 'Please install the <a href="http://wordpress.org/plugins/woocommerce/" target="_blank">WooCommerce plugin</a>, otherwise you can not use Fancy Product Designer for woocommerce!', 'radykal' ); ?></p>
		    </div>
		    <?php endif;

			if( version_compare($woocommerce->version, '2.1', '<') ): ?>
			<div class="error">
		        <p><?php _e( 'Please update woocommerce to the latest version! Fancy Product Designer is only working with V2.1 or newer.', 'radykal' ); ?></p>
		    </div>
			<?php endif;

			if( version_compare(Multistep_Product_Configurator::VERSION, '1.0.4', '<') && class_exists('Fancy_Product_Designer') && version_compare(Fancy_Product_Designer::VERSION, '1.0.0', '>')) : ?>

			<div class="error">
		        <p><?php _e( 'Please update Multistep Product Configurator to the latest version! Your version is not compatible with the current Fancy Product Designer version!', 'radykal' ); ?></p>
		    </div>

			<?php endif;

		}
	}
}

new KMSPC_Admin();

?>