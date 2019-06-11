<?php
    /**
     * @package WordPress
     * @subpackage Default_Theme
     */
?>

<div>
    <?php
        if(get_previous_posts_link()) {
            previous_posts_link( '‹ Previous Page' );
        }else{
            echo '<span class="disabled">‹ Previous Page</span>';
        }
    ?>
</div>

<div>
    Page <?php $page_num = (get_query_var('paged')) ? get_query_var('paged') : 1;  echo $page_num.' of '.$wp_query->max_num_pages; ?>
</div>

<div>
    <?php
        if(get_next_posts_link()) {
            next_posts_link( 'Next Page ›' );
        }else{
            echo '<span class="disabled">Next Page ›</span>';
        }
    ?>
</div>