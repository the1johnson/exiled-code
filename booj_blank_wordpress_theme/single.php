<?php
    /**
    * @package WordPress
    * @subpackage Default_Theme
    */
    get_header();
?>

<?php if (have_posts()): while (have_posts()) : the_post(); ?>
    
    <?php
        $featurePostID = get_post_thumbnail_id();
        $postExcerpt = get_the_excerpt();
        $tags = array("<p>", "</p>");
        $postExcerpt = str_replace($tags, "", $postExcerpt);
        $postSubtitle = get_post_meta(get_the_ID(), 'subtitle', true);
        
        if( has_post_thumbnail() ){
            $featureImageArray = wp_get_attachment_image_src($featurePostID, 'full');
            $featureImageURL = $featureImageArray[0];
        }else{
            $featureImageURL = 'https://placehold.it/600x400';
        }
    ?>
    <div class="single-post-featured-image post-thumb" style="background-image: url(<?php echo $featureImageURL; ?>);"></div>
    <div><?php the_title('',''); ?></div>
    <?php if (strlen($postSubtitle)): ?>
        <div>
            <?php echo $postSubtitle; ?>
        </div>
    <?php endif; ?>
    <div>Posted in <?php the_category(', '); ?> on <?php the_time('F j, Y'); ?></div>
    <div class="cms-page full-post-content">
        <?php echo the_content(); ?>
    </div>
    <div class="h3 font-playfair no-text-transform text-center margin-top-75">Leave a Comment</div>
    <div id="disqus_thread" class="margin-top-30"></div>
    <script type="text/javascript">
        /* * * CONFIGURATION VARIABLES * * */
        var disqus_shortname = 'live-luxe';

        /* * * DON'T EDIT BELOW THIS LINE * * */
        (function() {
            var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
                dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
            (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
        })();
    </script>
    <noscript>Please enable JavaScript to view the <a href="https://disqus.com/?ref_noscript" rel="nofollow">comments powered by Disqus.</a></noscript>
    
    <?php get_sidebar(); ?>
    
<?php endwhile; ?>
<?php else: ?>
    <div>Sorry, nothing to display.</div>
<?php endif; ?>

<?php get_footer(); ?>