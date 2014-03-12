<?php
require_once '../dao/UsersDAO.php';
require_once '../dao/ShippInfoDAO.php';
require_once '../bo/UserBO.php';
session_start();
if (!isset($_SESSION['cartItems'])){$_SESSION['cartItems'] = 0; $cartItems = $_SESSION['cartItems'];}else {$cartItems = $_SESSION['cartItems'];}
if(!isset($_SESSION['user'])){header("location: login.php");}
$username = $_SESSION['user'];

$userBo = new UserBO();

$userBo->setShippInfoId(UsersDAO::checkShippId($username));
$shippId = $userBo->getShippInfoId();

$userBo->setFname(ShippInfoDAO::checkFname($shippId));
$fName = $userBo->getFname();

$userBo->setLname(ShippInfoDAO::checkLname($shippId));
$lName = $userBo->getLname();

$pnum = ShippInfoDAO::checkPnum($shippId);
$address = ShippInfoDAO::checkAddress($shippId);
$city = ShippInfoDAO::checkCity($shippId);
$state = ShippInfoDAO::checkState($shippId);
$zip = ShippInfoDAO::checkZip($shippId);

$isAdmin = $_SESSION['isAdmin'];
echo "
<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<title>&#201;couter.com</title>

<link href='../css/reset.css' rel='stylesheet' type='text/css' />
<link href='../css/ecouter.css' rel='stylesheet' type='text/css' />

<script src='../cart/js/jquery-1.2.6.pack.js' type='text/javascript'></script>  
<script src='../cart/js/jquery.color.js' type='text/javascript'></script>  
<script src='../cart/js/thickbox.js' type='text/javascript'></script>  
<script src='../cart/js/cart.js' type='text/javascript'></script>
<script src='../js/livevalidation.js' type='text/javascript'></script>   
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
  var d=document; if(d.../images){ if(!d.MM_p) d.MM_p=new Array();
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
 	  <a href='login.php' class='links'>login/register</a> <span class='links'>|</span><a href='../view/profile.php' class='links'>my account</a><span class='links'>|</span><a href='../service/logout.php' class='links'>logout</a>
</div>
      
      <div id='cart'>
      <a href='cart.php?KeepThis=true&TB_iframe=true&height=400&width=780' title='Your Shopping Cart' class='thickbox' >view bag  ($cartItems items)</a>
      <img src='../images/bag.jpg'/>
      </div>
      
  </div>

<!--NAV -->
<div id='nav'>
  <a href='../index.php' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('home','','../rollovers/home.jpg',1)'><img src='../images/home.jpg' name='home' width='74' height='37' border='0' id='home' /></a>
  <a href='products.php?type=shoes&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('shoes','','../rollovers/shoes.jpg',1)'><img src='../images/shoes.jpg' alt='shoes' name='shoes' width='61' height='37' border='0' id='shoes' /></a>
  <a href='products.php?type=belts&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('belts','','../rollovers/belts.jpg',1)'><img src='../images/belts.jpg' name='belts' width='56' height='37' border='0' id='belts' /></a>
  <a href='products.php?type=cuffs&ipp=15&page=1' onmouseout='MM_swapImgRestore()' onmouseover='MM_swapImage('cufflinks','','../rollovers/cufflinks.jpg',1)'><img src='../images/cufflinks.jpg' name='cufflinks' width='91' height='37' border='0' id='cufflinks' /></a>
  </div>

<div id='searchbar'>
<form action='../service/search_call.php' target='_top'>
<input name='search' value='search' type='text'>
<input type='submit' value='' class='search_button' src='images/searchglass.jpg' type='image'>
</form>
</div>


<div id='cartcontent'>
<form name='checkout' action='../service/checkout_call.php' method='post'>
<p class='righttitlereg'>Shipping Info</p>
<p class='righttitlereg'>Fname <input name='fname' id='fname' type='text' value = $fName ></p>
<p class='righttitlereg'>Lname <input name='lname' id='lname' type='text' value = $lName ></p>
<p class='righttitlereg'>Phone# <input name='pnum' id='pnum' type='text' value = $pnum ></p>
<p class='righttitlereg'>Address <input name='address' id='address' type='text' value = $address ></p>
<p class='righttitlereg'>City <input name='city' id='city' type='text' value = $city ></p>
<p class='righttitlereg'>State <input name='state' id='state' type='text' value = $state ></p>
<p class='righttitlereg'>Zip <input name='zip' id='zip' type='text' value = $zip ></p>
<input type='hidden' name='shippId' value='$shippId' />
<p class='righttitlereg'><input type='submit' value='Continue' /></p>
</form>
<br/>
<script type='text/javascript'>
	var fname = new LiveValidation('fname');
	fname.add(Validate.Presence);
	var lname = new LiveValidation('lname');
	lname.add(Validate.Presence);
	var pnum = new LiveValidation('pnum');
	pnum.add(Validate.Presence);
	pnum.add(Validate.Numericality);
	pnum.add(Validate.Length, {minimum: 10, maximum:10});
	var address = new LiveValidation('address');
	address.add(Validate.Presence);
	var state = new LiveValidation('state');
	state.add(Validate.Presence);
	var zip = new LiveValidation('zip');
	zip.add(Validate.Presence);
	zip.add(Validate.Numericality);
	zip.add(Validate.Length, {minimum: 5, maximum:12});
	
</script>
      
  <div id='userprofile'>
  
  </div>


</div>



</div>

<div id='spacer'>
</div>

<!--END WRAPPER -->
</div>


<div class='clear'></div>
<br/>

<div id='footer'>

	<div class='wrapper'>
        <br/>
      <div id='footlogo'><a align='center' href='../index.html'><img src='../images/footlogo.jpg'/></a></div>
      <div id='footlinks'>
        <p class='bottomleftlinks'>
        <a class='footleft' href='profile.php'>view my account  </a> 
		<a href='cart.php?KeepThis=true&TB_iframe=true&height=400&width=780' title='Your Shopping Cart' class='thickbox' >view bag  </a> 
		<a class='footleft' href='../service/logout.php'>logout</a></p>

        
        
        <p class='bottomrightlinks'>
         <a class='footright' href='../index.php'>home </a>  |  
		 <a class='footright' href='products.php?type=shoes&ipp=15&page=1'>shoes  </a>   |  
		 <a class='footright' href='products.php?type=belts&ipp=15&page=1'>belts  </a>  |  
		 <a class='footright' href='products.php?type=cuffs&ipp=15&page=1'>cufflinks</a> 
        </p>
     
        
      </div>

    
	</div>
    <div id='bottombar'>
    <p>&copy; 2010  Ecouter.com   |   All Rights Reserved.</p>
	</div>
</div>

</body>
</html>
";


?>