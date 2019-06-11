<?php
    /**
     * @package WordPress
     * @subpackage Default_Theme
     */
    if( has_post_thumbnail() ){
        $postFeatureImageArray = wp_get_attachment_image_src(get_post_thumbnail_id(), 'full');
        $postFeatureImageURL = $postFeatureImageArray[0];
    }else{
        $postFeatureImageURL = 'https://placehold.it/600x400';
    }
?>
<a href="<?php the_permalink();?>" title="Read More About <?php the_title('',''); ?>">
    <div style="background-image: url(<?php echo $postFeatureImageURL; ?>);"></div>
    <div><?php the_title('',''); ?></div>
    <div><?php the_time('F j, Y'); ?></div>
</a>