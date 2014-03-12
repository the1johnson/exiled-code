<?php

class Validation {
	public static function validateName($pName){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pName)){
			if (preg_match('/\S+/', $pName)){
				//echo"SHOULD HAVE A VALUE    ".$pName;
			}else{
				Echo "Please sure your text fields have values<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
			exit();
		}
	}
	public static function validatePassword($pPassword){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pPassword)){
			if (preg_match('/\S{6,20}/', $pPassword)){
				//echo"SHOULD HAVE A VALUE    ".$pPassword;
			}else{
				echo "Please sure your password field has a value<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
		}
	}
	public static function validateEmail($pEmail){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pEmail)){
			if (preg_match('/([\w-\.]+)@((?:[\w]+\.)+)([a-zA-Z]{2,4})/', $pEmail)){
				//echo"SHOULD HAVE A VALUE    ".$pEmail;
			}else{
				Echo "Please enter a valid email address<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
			exit();
			}
	}
	public static function validatePnum($pPnum){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pPnum)){
			if (preg_match('/\d{10,10}/', $pPnum)){
				//echo"SHOULD HAVE A VALUE    ".$pEmail;
			}else{
				Echo "Please enter your phone number with no spaces or characters.<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
			exit();
			}
	}
	public static function validateAddress($pAddress){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pAddress)){
			if (preg_match('/\d+\w+\s\w+\s\w+/', $pAddress)){
				//echo"SHOULD HAVE A VALUE    ".$pEmail;
			}else{
				Echo "Plase insert a valid US address.<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
			exit();
			}
	}
	public static function validateZip($pZip){
		if(!preg_match("/'(?:\.|(\\\')|[^\''\n])*'/", $pZip)){
			if (preg_match('/\d{5,12}/', $pZip)){
				//echo"SHOULD HAVE A VALUE    ".$pEmail;
			}else{
				Echo "Please enter a valid US zip code.<br />
				You will be redirected in <span id='counttime'></span> seconds";
				exit();
			}
		}else {
			echo "Quotes are not allowed in your fields<br />
				You will be redirected in <span id='counttime'></span> seconds";
			exit();
			}
	}
}
?>