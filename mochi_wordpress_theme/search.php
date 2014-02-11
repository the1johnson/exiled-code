<?php get_header(); ?>
<section id="content" role="main">
<?php if ( have_posts() ) : ?>
<header class="header">
<h1 class="entry-title searched"><?php printf( __( 'Search results for: %s', 'mochiblog' ), get_search_query() ); ?></h1>
</header>
<?php while ( have_posts() ) : the_post(); ?>
<?php get_template_part( 'entry-summary' ); ?>
<?php endwhile; ?>
<?php get_template_part( 'nav', 'below' ); ?>
<?php else : ?>
<h1 class="entry-title searched"><?php printf( __( 'Search results for: %s', 'mochiblog' ), get_search_query() ); ?></h1>
<article id="post-0" class="no-results not-found">
<header class="header">
<h2><?php _e( 'Nothing Found.', 'mochiblog' ); ?></h2>
</header>
</article>
<?php endif; ?>
</section>
<?php get_sidebar(); ?>
<?php get_footer(); ?>