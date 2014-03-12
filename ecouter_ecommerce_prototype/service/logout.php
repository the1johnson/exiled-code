<?php
session_start();
session_unset();
session_destroy();
	echo "<!DOCTYPE html PUBLIC '-//W3C//DTD XHTML 1.0 Transitional//EN' 'http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd'>
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
<meta http-equiv='Content-Type' content='text/html; charset=UTF-8' />
<title>Écouter.com</title>

<link href='../css/reset.css' rel='stylesheet' type='text/css' />
<link href='../css/ecouter.css' rel='stylesheet' type='text/css' />
 <script language='JavaScript'>
var time = 7; 
var page = '../view/login.php';
function countDown(){
time--;
gett('counttime').innerHTML = time;
if(time == -1){
window.location = page;
}
}
function gett(id){
if(document.getElementById) return document.getElementById(id);
if(document.all) return document.all.id;
if(document.layers) return document.layers.id;
if(window.opera) return window.opera.id;
}
function init(){
if(gett('counttime')){
setInterval(countDown, 1000);
gett('counttime').innerHTML = time;
}
else{
setTimeout(init, 50);
}
}
document.onload = init();
</SCRIPT></head>
<body>

You will be redirected in <span id='counttime'></span> seconds
</body></html>";
?>