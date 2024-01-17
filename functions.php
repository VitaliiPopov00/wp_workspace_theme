<?php

add_action('wp_enqueue_scripts', 'theme_add_scripts');

function theme_add_scripts() {
    wp_enqueue_style('style', get_template_directory_uri() . '/assets/css/style.css');

    // wp_enqueue_script('vue', 'https://unpkg.com/vue@3/dist/vue.global.js');
    // wp_enqueue_script('script', get_template_directory_uri() . '/assets/js/script.js');
}
