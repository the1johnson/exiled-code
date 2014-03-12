<?php
session_start();
require_once '../utils/Search.php';
$seachVal = $_GET['search'];
if (!isset($_SESSION['cartItems'])){$_SESSION['cartItems'] = 0; $cartItems = $_SESSION['cartItems'];}else {$cartItems = $_SESSION['cartItems'];}
$itemType = 'shoes';
echo "
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<title>&#201;couter.com</title>

<link rel='shortcut icon' href='favicon.ico' type='image/x-icon'/>

<link href='../css/reset.css' rel='stylesheet' type='text/css' />
<link href='../css/ecouter.css' rel='stylesheet' type='text/css' />


<script src='../cart/js/jquery-1.2.6.pack.js' type='text/javascript'></script>  
<script src='../cart/js/jquery.color.js' type='text/javascript'></script>  
<script src='../cart/js/thickbox.js' type='text/javascript'></script>  
<script src='../cart/js/cart.js' type='text/javascript'></script>  
<link href='../cart/css/style.css' rel='stylesheet' type='text/css' media='screen' /> 
<link href='../cart/css/thickbox.css' rel='stylesheet' type='text/css' media='screen' /> 

<script type='text/javascript' src='js/jquery.js'>
</script>

<script type='text/javascript'>  
	$(function() {  
		$('form.cart_form').submit(function() {  
			var title = 'Your Shopping Cart';  
			var orderCode = $('input[name=orderCode]', this).val();  
			var quantity = $('input[name=quantity]', this).val();  
			var url = '../service/cart_action.php?orderCode=' + orderCode + '&quantity=' + quantity + '&TB_iframe=true&height=400&width=780';  
			tb_show(title, url, false);  
			   
			return false;  
		});  
	}); 
</script>


<script type='text/javascript'>
function MM_swapImgRestore() { //v3.0
  var i,x,a=document.MM_sr; for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++) x.src=x.oSrc;
}
function MM_preloadImages() { //v3.0
  var d=document; if(d.images){ if(!d.MM_p) d.MM_p=new Array();
    var i,j=d.MM_p.length,a=MM_preloadImages.arguments; for(i=0; i<a.length; i++)
    if (a[i].indexOf('#')!=0){ d.MM_p[j]=new Image; d.MM_p[j++].src=a[i];}}
}

function MM_findObj(n, d) { //v4.01
  var p,i,x;  if(!d) d=document; if((p=n.indexOf('?'))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_swapImage() { //v3.0
  var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array; for(i=0;i<(a.length-2);i+=3)
   if ((x=MM_findObj(a[i]))!=null){document.MM_sr[j++]=x; if(!x.oSrc) x.oSrc=x.src; x.src=a[i+2];}
}
</script>
</head>

<body onload='MM_preloadImages('../rollovers/home.jpg','../rollovers/shoes.jpg','../rollovers/belts.jpg','../rollovers/cufflinks.jpg','../rollovers/oxford.jpg','../rollovers/loafer.jpg','../rollovers/dress_boots.jpg','../rollovers/captoe.jpg','../rollovers/monkstrap.jpg','../rollovers/belts-31.jpg')'>

<div id='topbar'>
</div>


<div class='wrapper'>
  <div id='header'>
      <div id='logo'>
      <a href='../index.php' title='&#201;couter.com - Home' ><div id='home-link'><span>Home</span></div></a> 
      </div>
      
      <div id='signin'>
 	  <a href='../view/login.php' class='links'>login/register</a> <span class='links'>|</span> <a href='../view/profile.php' class='links'>my account</a><span class='links'>|</span><a href='logout.php' class='links'>logout</a>
</div>
      
      <div id='cart'>
      <a href='../view/cart.php?KeepThis=true&TB_iframe=true&height=400&width=780' title='Your Shopping Cart' class='thickbox' >view bag  ($cartItems items)</a>
      <img src='../images/bag.jpg'/>
      </div>
      
</div>

<!--NAV -->
<div id='nav'>";
      if ($itemType == 'shoes'||$itemType=='oxford'||$itemType=='loafer'||$itemType=='dress boot'||$itemType=='captoe'||$itemType=='monk strap'){
	echo"<a href='../index.php' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('home','','../rollovers/home.jpg',1)'><img src='../images/home.jpg' name='home' width='74' height='37' border='0' id='home' /></a>
      <a href='../view/products.php?type=shoes&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('shoes','','../rollovers/shoes.jpg',1)'><img src='../rollovers/shoes.jpg' alt='shoes' name='shoes' width='61' height='37' border='0' id='shoes' /></a>
      <a href='../view/products.php?type=belts&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('belts','','../rollovers/belts.jpg',1)'><img src='../images/belts.jpg' name='belts' width='56' height='37' border='0' id='belts' /></a>
      <a href='../view/products.php?type=cuffs&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('cufflinks','','../rollovers/cufflinks.jpg',1)'><img src='../images/cufflinks.jpg' name='cufflinks' width='91' height='37' border='0' id='cufflinks' /></a>
      ";
}elseif ($itemType == 'belts'){
	echo"<a href='../index.php' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('home','','../rollovers/home.jpg',1)'><img src='../images/home.jpg' name='home' width='74' height='37' border='0' id='home' /></a>
      <a href='../view/products.php?type=shoes&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('shoes','','../rollovers/shoes.jpg',1)'><img src='../images/shoes.jpg' alt='shoes' name='shoes' width='61' height='37' border='0' id='shoes' /></a>
      <a href='../view/products.php?type=belts&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('belts','','../rollovers/belts.jpg',1)'><img src='../rollovers/belts.jpg' name='belts' width='56' height='37' border='0' id='belts' /></a>
      <a href='../view/products.php?type=cuffs&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('cufflinks','','../rollovers/cufflinks.jpg',1)'><img src='../images/cufflinks.jpg' name='cufflinks' width='91' height='37' border='0' id='cufflinks' /></a>
      ";
}elseif ($itemType == 'cuffs'){
	echo"<a href='../index.php' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('home','','../rollovers/home.jpg',1)'><img src='../images/home.jpg' name='home' width='74' height='37' border='0' id='home' /></a>
      <a href='../view/products.php?type=shoes&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('shoes','','../rollovers/shoes.jpg',1)'><img src='../images/shoes.jpg' alt='shoes' name='shoes' width='61' height='37' border='0' id='shoes' /></a>
      <a href='../view/products.php?type=belts&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('belts','','../rollovers/belts.jpg',1)'><img src='../images/belts.jpg' name='belts' width='56' height='37' border='0' id='belts' /></a>
      <a href='../view/products.php?type=cuffs&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('cufflinks','','../rollovers/cufflinks.jpg',1)'><img src='../rollovers/cufflinks.jpg' name='cufflinks' width='91' height='37' border='0' id='cufflinks' /></a>
      ";
}
echo"</div>

<div class='wrapper'>
<div id='searchbar'>
<form action='search_call.php' target='_top'>
<input name='search' value='search' type='text'>
<input type='submit' value='' class='search_button' src='images/searchglass.jpg' type='image'>
</form>
</div>
</div>

<div id='leftcolumn'>
<p class='categories'>Categories</p>
      <a href='../view/products.php?type=oxford&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('oxford','','../rollovers/oxford.jpg',1)'><img src='../images/oxford.jpg' name='oxford' width='115' height='123' border='0' id='oxford' /></a>
      <a href='../view/products.php?type=loafer&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('loafers','','../rollovers/loafer.jpg',1)'><img src='../images/loafer.jpg' name='loafers' width='115' height='123' border='0' id='loafers' /></a>
      <a href='../view/products.php?type=dress boot&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('dressboots','','../rollovers/dress_boots.jpg',1)'><img src='../images/dress_boots.jpg' name='dressboots' width='115' height='123' border='0' id='dressboots' />
      </a><a href='../view/products.php?type=captoe&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('captoes','','../rollovers/captoe.jpg',1)'><img src='../images/captoe.jpg' name='captoes' width='115' height='123' border='0' id='captoes' /></a>
      <a href='../view/products.php?type=monk strap&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('monkstrap','','../rollovers/monkstrap.jpg',1)'><img src='../images/monkstrap.jpg' name='monkstrap' width='115' height='123' border='0' id='monkstrap' /></a>
      <a href='../view/products.php?type=belts&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('belt_box','','../rollovers/belts-31.jpg',1)'><img src='../images/belts-31.jpg' name='belt_box' width='115' height='123' border='0' id='belt_box' /></a>
</div>


      <div id='rightcolumn'>
          <p class='righttitle'>Featured Items</p>";
//for ($i=0; $i<6; $i++)
  		//{
			//if ($i>0 && $i <= 1){
				Search::likeSearch('shoes', $seachVal);
			//}elseif ($i>2 && $i<=3){
				Search::likeSearch('belts', $seachVal);
			//}elseif ($i>4 && $i<=5){
				Search::likeSearch('cuffs', $seachVal);	
			//}
 		//} 

echo"
      </div>

<!--END WRAPPER -->
</div>


<div class='clear'></div>
<br/>

<div id='footer'>
	<div class='wrapper'>
        <br/>
      <div id='footlogo'><a align='center' href='index.html'><img src='images/footlogo.jpg'/></a></div>
      <div id='footlinks'>
        <p class='bottomleftlinks'>
        <a class='footleft' href='view/profile.php'>view my account  </a> 
		<a class='footleft' href='#'>view bag  </a> 
		<a class='footleft' href='#'>logout</a></p>
        
        
        <p class='bottomrightlinks'>
         <a class='footright' href='index.php'>home </a>  |  
		 <a class='footright' href='view/products.php?type=shoes&ipp=15&page=1'>shoes  </a>   |  
		 <a class='footright' href='view/products.php?type=belts&ipp=15&page=1'>belts  </a>  |  
		 <a class='footright' href='view/products.php?type=cuffs&ipp=15&page=1'>cufflinks</a> 
        </p>
     
        
      </div>
    
	</div>
    <div id='bottombar'>
    <p>&copy; 2010  Ecouter.com   |   All Rights Reserved.</p>
	</div>
</div>

</body>
</html>";
?>