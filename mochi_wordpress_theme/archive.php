<?php get_header(); ?>
<section id="content" role="main">
<header class="header">
<h1 class="entry-title searched"><?php 
if ( is_day() ) { printf( __( 'Daily Archives: %s', 'mochiblog' ), get_the_time( get_option( 'date_format' ) ) ); }
elseif ( is_month() ) { printf( __( 'Monthly Archives: %s', 'mochiblog' ), get_the_time( 'F Y' ) ); }
elseif ( is_year() ) { printf( __( 'Yearly Archives: %s', 'mochiblog' ), get_the_time( 'Y' ) ); }
else { _e( 'Archives', 'mochiblog' ); }
?></h1>
</header>
<?php if ( have_posts() ) : while ( have_posts() ) : the_post(); ?>
<?php get_template_part( 'entry-summary' ); ?>
<?php endwhile; endif; ?>
<?php get_template_part( 'nav', 'below' ); ?>
</section>
<?php get_sidebar(); ?>
<?php get_footer(); ?>