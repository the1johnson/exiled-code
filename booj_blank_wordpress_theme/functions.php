<?php
/**
 * @package WordPress
 * @subpackage Default_Theme
 */

/* Add theme support for wordpress usefulness */
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'post-thumbnails' );

// Navigation Menus - http://codex.wordpress.org/Navigation_Menus
function bp_register_template_menu() {
    register_nav_menu( 'headerMenu', __( 'Header Menu', 'BoojPress' ) );
}
add_action( 'init', 'bp_register_template_menu' );

add_filter('show_admin_bar', '__return_false');

// add_filter('next_post_link', 'post_link_attributes');
// add_filter('previous_post_link', 'post_link_attributes');

// function post_link_attributes($output) {
//     $code = 'class="btn btn-primary"';
//     return str_replace('<a href=', '<a '.$code.' href=', $output);
// }

// Add extra contact info to user profile page
function extra_contact_info($contactmethods) {
    unset($contactmethods['aim']);
    unset($contactmethods['yim']);
    unset($contactmethods['jabber']);
    $contactmethods['facebook'] = 'Facebook';
    $contactmethods['twitter'] = 'Twitter';
    $contactmethods['linkedin'] = 'LinkedIn';
    $contactmethods['pinterest'] = 'Pinterest';
    $contactmethods['googleplus'] = 'Google Plus';
    $contactmethods['instagram'] = 'Instagram';

    return $contactmethods;
}
add_filter('user_contactmethods', 'extra_contact_info');

/*function get_socials($content=''){
    $facebook = str_replace( 'http://', '', get_the_author_meta('facebook') );
    $twitter = str_replace( 'http://', '', get_the_author_meta('twitter') );
    $linkedin = str_replace( 'http://', '', get_the_author_meta('linkedin') );
    $pinterest = str_replace( 'http://', '', get_the_author_meta('pinterest') );
    $googleplus = str_replace( 'http://', '', get_the_author_meta('googleplus') );
    $instagram = str_replace( 'http://', '', get_the_author_meta('instagram') );

    $html.="";
    if ($facebook) $html.="<li class='margin-right-5'><a href='http://".$facebook."' title='Facebook' target='_blank'><i class='icon icon-facebook'></i></a></li>";
    if ($twitter) $html.="<li class='margin-right-5 margin-left-5'><a href='https://".$twitter."' title='Twitter' target='_blank'><i class='icon icon-twitter'></i></a></li>";
    if ($linkedin) $html.="<li class='margin-right-5 margin-left-5'><a href='https://".$linkedin."' title='LinkedIn' target='_blank'><i class='icon icon-linkedin'></i></a></li>";
    if ($pinterest) $html.="<li class='margin-right-5 margin-left-5'><a href='https://".$pinterest."' title='Pinterest' target='_blank'><i class='icon icon-pinterest'></i></a></li>";
    if ($googleplus) $html.="<li class='margin-right-5 margin-left-5'><a href='https://".$googleplus."' title='Google+' target='_blank'><i class='icon icon-google-plus'></i></a></li>";
    if ($instagram) $html.="<li class='margin-left-5'><a href='https://".$instagram."' title='Instagram' target='_blank'><i class='icon icon-instagram'></i></a></li>";

    $content=$html;
    return $content;
}*/

function get_post_excerpt_by_id( $post_id ) {
    global $post;
    $post = get_post( $post_id );
    setup_postdata( $post );
    $the_excerpt = get_the_excerpt();
    wp_reset_postdata();
    return $the_excerpt;
}
?>
