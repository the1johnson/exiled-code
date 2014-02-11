<section class="entry-summary">
<header>
<?php if ( is_singular() ) { echo '<h1 class="entry-title">'; } else { echo '<h2 class="entry-title">'; } ?><a href="<?php the_permalink(); ?>" title="<?php the_title_attribute(); ?>" rel="bookmark"><?php the_title(); ?></a><?php if ( is_singular() ) { echo '</h1>'; } else { echo '</h2>'; } ?> <?php edit_post_link(); ?>
<?php if ( !is_search() ) get_template_part( 'entry', 'meta' ); ?>
</header>
<?php
    if(strlen(catch_that_image()) > 20){
        echo '<a href="',the_permalink(),'">','<img src="',catch_that_image(),'" alt="" /></a>';
        the_excerpt();
    }else{
        the_excerpt();
    }
?>
<?php if ( !is_search() ) get_template_part( 'entry-footer' ); ?>
<?php if( is_search() ) { ?><div class="entry-links"><?php wp_link_pages(); ?></div><?php } ?>
</section>