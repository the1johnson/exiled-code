<aside id="sidebar" role="complementary">
    <form method="get" id="searchform" action="<?php bloginfo('home'); ?>/">
    <div><input type="text" size="18" value="<?php echo wp_specialchars($s, 1); ?>" name="s" id="s" placeholder="Search" />
    <input type="submit" id="searchsubmit" value="Search" class="btn" />
    </div>
    </form>
    <div class="explore">
        <div class="lead">Explore</div>
        <ul>
            <li class="first"><a href="<?php echo get_page_link(11); ?>">About</a></li>
            <li><div class="archives">
                <a href="#" id="arch">Archives</a>
                <ul id="arch-drop" style="display: none;">
                    <?php
                        $arch_args = array(
                        	'type'            => 'monthly',
                        	'limit'           => '',
                        	'format'          => 'html', 
                        	'before'          => '',
                        	'after'           => '',
                        	'show_post_count' => true,
                        	'echo'            => 1,
                        	'order'           => 'DESC'
                        );
                        wp_get_archives( $arch_args );
                    ?>
            </ul>
            </div></li>
            <li><a href="http://www.mochimedia.com/community" target="_blank">Forum</a></li>
            <li class="last"><a href="<?php echo get_page_link(13); ?>">Contact</a></li>
        </ul>
    </div>
    <?php
        $categ_args = array(
        	'show_option_all'    => '',
        	'orderby'            => 'name',
        	'order'              => 'ASC',
        	'style'              => 'list',
        	'show_count'         => 1,
        	'hide_empty'         => 1,
        	'use_desc_for_title' => 1,
        	'child_of'           => 0,
        	'feed'               => '',
        	'feed_type'          => '',
        	'feed_image'         => '',
        	'exclude'            => '',
        	'exclude_tree'       => '',
        	'include'            => '',
        	'hierarchical'       => 1,
        	'title_li'           => __( '<div class="lead">Topics</div>' ),
        	'show_option_none'   => __('No categories'),
        	'number'             => null,
        	'echo'               => 1,
        	'depth'              => 0,
        	'current_category'   => 0,
        	'pad_counts'         => 0,
        	'taxonomy'           => 'category',
        	'walker'             => null
        );
        wp_list_categories( $categ_args ); 
    ?> 
</aside>