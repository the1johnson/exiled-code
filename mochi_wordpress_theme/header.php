<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>" />
<meta name="viewport" content="width=device-width" />
<title><?php wp_title( ' | ', true, 'right' ); ?></title>
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/js/jquery.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/js/reset.js"></script>
<script type="text/javascript" src="<?php bloginfo('template_url'); ?>/js/global.js"></script>
<link rel="stylesheet" type="text/css" href="<?php echo get_stylesheet_uri(); ?>" />
<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<div id="wrapper" class="hfeed">
<header id="header" role="banner">
<nav id="menu" role="navigation">
    <div class="container">
        <section id="branding">
            <a href="http://www.mochimedia.com/"><h1 class="mochi-logo">Mochi Media</h1></a>
        </section>
        <!--<ul id="nav">
            <li class="dropdown dev-li">
                <a href="http://www.mochimedia.com/developers/" class="dev-link">Developers</a>
                <ul class="dropdown-menu dev" style="display: none;">
                <li class="ads-api-item"><a href="http://www.mochimedia.com/developers#nav-ads-api" class="ads-api">Ads API</a></li>
                <li class="game-distribution-item"><a href="http://www.mochimedia.com/developers#nav-game-distribution" class="game-distribution">Game Distribution</a></li>
                <li class="live-updates-item"><a href="http://www.mochimedia.com/developers#nav-live-updates" class="live-updates">Live Updates</a></li>
                <li class="scores-api-item"><a href="http://www.mochimedia.com/developers#nav-scores-api" class="scores-api">Scores API</a></li>
                <li class="analytics-api-item"><a href="http://www.mochimedia.com/developers#nav-analytics-api" class="analytics-api">Analytics API</a></li>
                <li class="achievements-api-item"><a href="http://www.mochimedia.com/developers#nav-achievements-api" class="achievements-api">Achievements API</a>
                </li>
              </ul>
            </li>
            <li class="dropdown pub-li">
                <a href="http://www.mochimedia.com/publishers/" class="pub-link">Publishers</a>
                <ul class="dropdown-menu pub" style="display: none;">
                <li><a href="http://www.mochimedia.com/publishers#nav-free-content" class="free-content">Free Content</a></li>
                <li><a href="http://www.mochimedia.com/publishers#nav-custom-integration" class="custom-integration">Custom Integration</a></li>
                <li><a href="http://www.mochimedia.com/publishers#nav-earn-affiliate-revenue" class="earn-affiliate-revenue">Earn Affiliate Revenue</a></li>
              </ul>
            </li>
            <li class="dropdown adv-li">
                <a href="http://www.mochimedia.com/advertisers/" class="adv-link">Advertisers</a>
                <ul class="dropdown-menu adv" style="display: none;">
                <li><a href="http://www.mochimedia.com/advertisers#nav-how-it-works">How it works</a></li>
                <li><a href="http://www.mochimedia.com/advertisers#nav-our-audience">Our audience</a></li>
                <li><a href="http://www.mochimedia.com/advertisers#nav-targeting">Targeting</a></li>
                <li><a href="http://www.mochimedia.com/advertisers#nav-self-serve">Self-Serve Ads</a></li>
              </ul>
            </li>
            <li class="dropdown more-li">
                <a href="#" class="more-link">More</a>
                <ul class="dropdown-menu more" style="display: none;">
                <li><a href="http://www.mochimedia.com/community">Community</a></li>
                <li><a href="http://www.mochimedia.com/games?">Games</a></li>
                <li><a href="http://www.mochimedia.com/contact.html">Contact Us</a></li>
                <li><a href="http://mochiland.com/" target="_blank">Mochi Land</a></li>
                <li><a href="http://www.mochigames.com" target="_blank">Mochigames.com</a></li>
              </ul>
            </li>
        </ul>
        <div class="authedin">
            <a href="http://www.mochimedia.com/login">Log In</a> or <a href="http://www.mochimedia.com/register">Sign up</a>
        </div>-->
    </div>
</nav>
<div class="title-bar">
    <div class="container"><a href="<?php echo esc_url( home_url( '/' ) ); ?>"><h2>Mochi Blog</h2></a></div>
</div>
</header>
<div class="container">