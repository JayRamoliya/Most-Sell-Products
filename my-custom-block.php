<?php
/**
 * Plugin Name:       My Custom Block
 * Description:       Example block scaffolded with Create Block tool.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       my-custom-block
 *
 * @package CreateBlock
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}



// ==============================================================================



function create_block_my_custom_block_block_init()
{
    register_block_type(__DIR__ . '/build',
        array(
            'render_callback' => 'gutenberg_examples_dynamic_render_callback',
        )
    );
}
add_action('init', 'create_block_my_custom_block_block_init');



// ==============================================================================



function gutenberg_examples_dynamic_render_callback($attributes){

    $mostsellvalue = isset($attributes['mostsellvalue']) ? $attributes['mostsellvalue'] : '';

    $api_url = 'http://localhost/wordpress/wp-json/cr/v1/mostproducts/' . $mostsellvalue;
    $response = wp_remote_get($api_url);
    $products = json_decode($response['body'], true);

    // echo '<pre>';
    // print_r($products);
    // echo '</pre>';


    if(is_array($products)){
        $content = '<ul>';
        foreach ($products as $product) {
          if(is_array($product)){
            $content .= '<li>';
            $content .= '<b>ID:</b> ' . $product['id'] . '<br>';
            $content .= '<b>NAME:</b> ' . $product['name'] . '<br>';
            $content .= '<b>SELL COUNT:</b> ' . $product['sell_count'] . '<br>';
            $content .= '</li>';
          }
        }
        $content .= '</ul>';
      } else {
        $content = '<p>No products found</p>';
      }
      
      return $content;
}
// $mostsellproducts = isset($attributes['mostsellproducts']) ? $attributes['mostsellproducts'] : '';



// ==============================================================================

















function my_plugin_register_meta()
{
    register_post_meta('products', 'sell_count', [
        'show_in_rest' => true,
        'single' => true,
        'type' => 'number',
    ]);
}
add_action('init', 'my_plugin_register_meta');
