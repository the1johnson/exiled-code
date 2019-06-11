<?php
    /**
     * @package WordPress
     * @subpackage Default_Theme
     */
    $loopCount = 0;
?>

<?php while (have_posts()) : the_post(); ?>
    <?php if ( $loopCount === 0 ): ?>
        <?php get_template_part('loop-post', 'featured'); ?>
    <?php else: ?>
        <?php get_template_part('loop-post'); ?>
    <?php endif; ?>
<?php $loopCount++; endwhile; ?>