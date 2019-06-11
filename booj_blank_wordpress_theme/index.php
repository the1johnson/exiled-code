<?php
    /**
     * @package WordPress
     * @subpackage Default_Theme
     */
    get_header();
?>
<?php if (have_posts()) : ?>
    <?php if (is_search()) : ?>
        Searching: <?php echo get_search_query(); ?>
    <?php elseif (is_category()): ?>
        Category: <?php single_cat_title(); ?>
    <?php elseif (is_tag()): ?>
        Tag: <?php single_tag_title(); ?>
    <?php endif; ?>

    <?php get_template_part('postsloop'); ?>
    <?php get_template_part('pager', 'posts'); ?>
<?php else: ?>
    <div>Not Found</div>
    <div>Sorry, but you are looking for something that isn't here.</div>
<?php endif; ?>

<?php get_footer(); ?>