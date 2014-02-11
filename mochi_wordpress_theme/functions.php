<?php
add_action( 'after_setup_theme', 'mochiblog_setup' );
function mochiblog_setup()
{
load_theme_textdomain( 'mochiblog', get_template_directory() . '/languages' );
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'post-thumbnails' );
global $content_width;
if ( ! isset( $content_width ) ) $content_width = 640;
register_nav_menus(
array( 'main-menu' => __( 'Main Menu', 'mochiblog' ) )
);
}
add_action( 'wp_enqueue_scripts', 'mochiblog_load_scripts' );
function getConnectionWithAccessToken($cons_key, $cons_secret, $oauth_token, $oauth_token_secret) {
  $connection = new TwitterOAuth($cons_key, $cons_secret, $oauth_token, $oauth_token_secret);
  return $connection;
}
function get_tweets()
{
    session_start();
    require_once("twitter/twitteroauth/twitteroauth.php"); //Path to twitteroauth library

    $twitteruser = "mochimedia";
    $notweets = 6;
    $consumerkey = "yF9HZXBjX8SgBpI5bK7xUA";
    $consumersecret = "10EgrJ3yj0rQ7Z0cJ9ptCrMb16SrG3m49b9AMj0o";
    $accesstoken = "3637341-1XBBKyERgpogqB9CXw0tIxA3G6vPdyGlpSZ53Ltuyo";
    $accesstokensecret = "AMIwYXIJKEMuVCLWD6SXmICAKnbMJUbX8o78t2nILLLZj";
    $q = 1;

    $connection = getConnectionWithAccessToken($consumerkey, $consumersecret, $accesstoken, $accesstokensecret);

    $tweets = $connection->get("https://api.twitter.com/1.1/statuses/user_timeline.json?screen_name=".$twitteruser."&count=".$notweets);

    $jtweets = json_encode($tweets);
    $atweets = json_decode($jtweets, TRUE);
    $regex = '/(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9]+)/';
    foreach($atweets as $k => $v){
         foreach($atweets[$k] as $q => $t){
             if($q == 'text'){
                 if(preg_match($regex, $t)){
                     preg_match($regex, $t, $matches);
                     $replaced = str_replace("@$matches[1]", "<a href='http://twitter.com/$matches[1]' target='_blank'>@$matches[1]</a>", $t);
                     echo "<li>$replaced</li>";
                 }else{
                     echo "<li>$t</li>";
                 }
             }
         }
    }
}
function catch_that_image() {
  global $post, $posts;
  $first_img = '';
  ob_start();
  ob_end_clean();
  $output = preg_match_all('/<img.+src=[\'"]([^\'"]+)[\'"].*>/i', $post->post_content, $matches);
  $first_img = $matches[1][0];

  if(empty($first_img)) {
    $first_img = "/path/to/default.png";
  }
  return $first_img;
}
function mochiblog_load_scripts()
{
wp_enqueue_script( 'jquery' );
}
add_action( 'comment_form_before', 'mochiblog_enqueue_comment_reply_script' );
function mochiblog_enqueue_comment_reply_script()
{
if ( get_option( 'thread_comments' ) ) { wp_enqueue_script( 'comment-reply' ); }
}
add_filter( 'the_title', 'mochiblog_title' );
function mochiblog_title( $title ) {
if ( $title == '' ) {
return '&rarr;';
} else {
return $title;
}
}
add_filter( 'wp_title', 'mochiblog_filter_wp_title' );
function mochiblog_filter_wp_title( $title )
{
return $title . esc_attr( get_bloginfo( 'name' ) );
}
add_action( 'widgets_init', 'mochiblog_widgets_init' );
function mochiblog_widgets_init()
{
register_sidebar( array (
'name' => __( 'Sidebar Widget Area', 'mochiblog' ),
'id' => 'primary-widget-area',
'before_widget' => '<li id="%1$s" class="widget-container %2$s">',
'after_widget' => "</li>",
'before_title' => '<h3 class="widget-title">',
'after_title' => '</h3>',
) );
}
function mochiblog_custom_pings( $comment )
{
$GLOBALS['comment'] = $comment;
?>
<li <?php comment_class(); ?> id="li-comment-<?php comment_ID(); ?>"><?php echo comment_author_link(); ?></li>
<?php 
}
add_filter( 'get_comments_number', 'mochiblog_comments_number' );
function mochiblog_comments_number( $count )
{
if ( !is_admin() ) {
global $id;
$comments_by_type = &separate_comments( get_comments( 'status=approve&post_id=' . $id ) );
return count( $comments_by_type['comment'] );
} else {
return $count;
}
}