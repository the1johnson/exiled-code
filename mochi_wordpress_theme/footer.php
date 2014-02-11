<footer id="footer" role="contentinfo">
    <div class="community">
        <a href="http://www.mochimedia.com/community" target="_blank">Join the discussion</a>
    </div>
    <div class="twitter">
        <a href="http://twitter.com/mochimedia" target="_blank"><div class="twitter-lead">Follow us on<br/>Twitter</div></a>
        <div id="twitt-feed">
            <ul>
                <?php get_tweets();?>
            </ul>
        </div>
    </div>
    <div class="social">
        <ul>
            <li><a href="http://www.facebook.com/mochimedia" class="facebook" target="_blank">Facebook</a></li>
            <li><a href="<?php bloginfo('rss_url'); ?>" class="rss" target="_blank">RSS</a></li>
            <li><a href="http://www.instagram.com/mochimedia" class="instagram" target="_blank">Instagram</a></li>
            <li><a href="https://plus.google.com/107889187791585381489" rel="publisher" class="google-plus" target="_blank">Google Plus</a></li>
        </ul>
    </div>
    <div id="copyright">
        &copy; 2014 Mochi Media, Inc.
    </div>
    <div id="reset"></div>
</footer>
<div class="clear"></div>
</div>
</div>
<?php wp_footer(); ?>
</body>
</html>