<?php
    /**
     * @package WordPress
     * @subpackage Default_Theme
     */

   define( 'BLOG_ROOT', get_template_directory_uri().'/' );
   define( 'SITE_HOME', 'http://bellator.com/' );
   define( 'BLOG_HOME', get_site_url());
   $content_origin = SITE_HOME . 'blog' . $_SERVER['REQUEST_URI'];
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?> style="margin-top: 0!important;">
    <head>
        <meta charset="<?php bloginfo('charset'); ?>">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="pingback" href="<?php bloginfo('pingback_url'); ?>" />
        <link rel="shortcut icon" href="<?php echo get_template_directory_uri(); ?>/favicon.ico">

        <?php
            if (is_single()) {
                if ( has_post_thumbnail() ) {
                    $thumb_id = get_post_thumbnail_id();
                    $thumb_url = wp_get_attachment_image_src($thumb_id,'thumbnail-size', true);
                    $featured_pic = $thumb_url[0];
                } else {
                    $featured_pic = 'https://placehold.it/600x400';
                }
            }
            
            ?>

            <?php
                if ( is_home() || is_front_page() || is_paged() ) {
                    $fb_home_img = 'https://placehold.it/600x400'; ?>
                    <meta property="og:image" content="<?php print_r($fb_home_img); ?>">
            <?php   } else {
                    if ( has_post_thumbnail() ){
                        $src = wp_get_attachment_url( get_post_thumbnail_id($post->ID) );
                    } else{
                        $src = 'https://placehold.it/600x400';
                    }
                $fb_home_img = $src; ?>
            <meta property="og:image" content="<?php print_r($fb_home_img); ?>">
            <meta name="twitter:image" content="<?php print_r($fb_home_img); ?>">
        <?php   } ?>
        
        <?php if ( ( is_home() && is_front_page() && !(is_paged()) ) || is_single() ) : ?>
            <meta name="robots" content="index, follow">
        <?php elseif (is_paged()): ?>
            <!-- YOAST is already doing this? -->
            <meta name="robots" content="noindex, follow">
        <?php endif; ?>
        <link rel="stylesheet" href="<?= BLOG_ROOT ?>company_styles.min.css" type="text/css" media="screen">
        <link rel="stylesheet" href="<?php bloginfo('stylesheet_url'); ?>" type="text/css" media="screen">
        
        <title>
            <?php
                if (is_single() && have_posts()){
                    while (have_posts()){
                        the_post();
                        the_title('','');
                    }
                }else{
                    echo 'Default Blog Title';
                }
            ?>
        </title>
        <?php wp_head(); ?>
    </head>
    <body <?php body_class(); ?>>
        
        <header id="site-header">
            

            <?php if (has_nav_menu('headerMenu')) : ?>
                <nav id="header-nav" class="xs-margin-top-15 sm-margim-top-0 sm-margin-left-30">
                    <?php
                        $navOpts = array(
                            'theme_location' => 'headerMenu',
                            'container' => '',
                            'menu_class' => '',
                            'menu_id' => 'boojstrap-menu'
                        );
                        wp_nav_menu($navOpts);
                    ?>
                </nav>
            <?php else: ?>
                <?php
                    $liveId = get_cat_ID( 'Live' );
                    $designId = get_cat_ID( 'Design' );
                    $experienceId = get_cat_ID( 'Experience' );
                    $categoryLinks = array( 'live'=> get_category_link( $liveId ), 'design'=>get_category_link( $designId ), 'experience'=>get_category_link( $experienceId ) );
                    
                ?>
                <nav id="header-nav" class="xs-margin-top-15 sm-margim-top-0 sm-margin-left-30">
                    <ul id="boojstrap-menu">
                        <li class="menu-item menu-item-type-taxonomy menu-item-object-category">
                            <a href="<?php echo $categoryLinks['live']; ?>">Live</a>
                        </li>
                        <li class="menu-item menu-item-type-taxonomy menu-item-object-category">
                            <a href="<?php echo $categoryLinks['design']; ?>">Design</a>
                        </li>
                        <li class="menu-item menu-item-type-taxonomy menu-item-object-category">
                            <a href="<?php echo $categoryLinks['experience']; ?>">Experience</a>
                        </li>
                    </ul>
                </nav>
            <?php endif; ?>
            
            <?php get_search_form(); ?>
        </header>
        