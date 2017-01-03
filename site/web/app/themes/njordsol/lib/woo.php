<?php

add_action( 'init', 'custom_remove_footer_credit', 10 );
function custom_remove_footer_credit () {
    remove_action( 'storefront_footer', 'storefront_credit', 20 );
    add_action( 'storefront_footer', 'custom_storefront_credit', 20 );
}

function custom_storefront_credit() {
    echo '<div class="site-info">';
    echo '&copy ' . get_bloginfo( 'name' ) . ' ' . get_the_date( 'Y' );
    echo '</div><!-- .site-info -->';
}

add_action( 'init', 'sf_child_remove_parent_theme_stuff', 0 );
function sf_child_remove_parent_theme_stuff() {
	remove_action( 'storefront_sidebar', 'storefront_get_sidebar', 10 );
}


add_action('init', 'delay_remove');
function delay_remove() {
    remove_action( 'woocommerce_after_shop_loop', 'woocommerce_catalog_ordering', 10 );
    remove_action( 'woocommerce_before_shop_loop', 'woocommerce_catalog_ordering', 10 );

    remove_action( 'woocommerce_after_shop_loop', 'woocommerce_result_count', 20 );
    remove_action( 'woocommerce_before_shop_loop', 'woocommerce_result_count', 20 );
}