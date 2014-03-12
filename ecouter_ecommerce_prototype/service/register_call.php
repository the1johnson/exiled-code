<?php
	require_once '../bo/UserBO.php';
	require_once '../dao/UsersDAO.php';
	require_once '../dao/ShippInfoDAO.php';
	require_once '../utils/Validation.php';
	$userName = $_POST['userName'];
	$password = $_POST['password'];
	$email = $_POST['email'];
	$fName = $_POST['fname'];
	$lName = $_POST['lname'];
	$isAdmin = "false";
	$usersBO = new UserBO();
	$usersBO->dataSet($userName, $password, $email, $fName, $lName, $isAdmin);
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
<body>";
	Validation::validateName($usersBO->getUserName());
	Validation::validatePassword($usersBO->getPassword());
	Validation::validateEmail($usersBO->getEmail());
	Validation::validateName($usersBO->getFname());
	Validation::validateName($usersBO->getPassword());
	if (UsersDAO::checkUser($usersBO->getUserName()) == "") {
		if (UsersDAO::checkEmail($usersBO->getEmail()) == "") {
			
			UsersDAO::pushUser($usersBO->getUserName(), $usersBO->getPassword(), $usersBO->getEmail(), $usersBO->getIsAdmin());
			UsersDAO::pushShippInfo($usersBO->getFname(), $usersBO->getLname());
			$shippId = ShippInfoDAO::getShippId($usersBO->getFname(), $usersBO->getLname());
			UsersDAO::updateUsersWshippid($usersBO->getUserName(), $shippId);
			
			}else {
				echo "username ok but email taken
				<br />
				You will be redirected in <span id='counttime'></span> seconds";
				die();
			}
	} else {
		echo "username taken
		<br />
		You will be redirected in <span id='counttime'></span> seconds";
		die();
	}
	
	echo "Successfuly Registered
	<br />
	You will be redirected in <span id='counttime'></span> seconds
	</body></html>";
?>