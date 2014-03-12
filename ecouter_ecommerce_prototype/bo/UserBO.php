<?php
class UserBO {
	private $userName = "";
	private $password = "";
	private $email = "";
	private $fName = "";
	private $lName = "";
	private $isAdmin = false;
	private $shippInfoId ;
	
	public function __construct() {
	//	echo "UserBO Class Constructed <br />";
	}
	///////////////////////////////
	////////GETTERS AND SETTERS
	///////////////////////////////
	
	//USERNAME
	public function getUserName(){
		return $this->userName;
	}
	public function setUserName($pUserName){
		$this->userName = $pUserName;
	}
	
	//PASSWORD
	public function getPassword(){
		return $this->password;
	}
	public function setPassword($pPassword){
		$this->password = $pPassword;
	}
	
	//EMAIL
	public function getEmail(){
		return $this->email;
	}
	public function setEmail($pEmail){
		$this->email = $pEmail;
	}
	
	//FIRST NAME
	public function getFname(){
		return $this->fName;
	}
	public function setFname($pFname){
		$this->fName = $pFname;
	}
	//LAST NAME
	public function getLname(){
		return $this->lName;
	}
	public function setLname($pLname){
		$this->lName = $pLname;
	}
	//ISADMIN
	public function getIsAdmin(){
		return $this->isAdmin;
	}
	public function setIsAdmin($pIsAdmin){
		$this->isAdmin = $pIsAdmin;
	}
	//SHIPPINFO ID
	public function getShippInfoId(){
		return $this->shippInfoId;
	}
	public function setShippInfoId($pShippInfoId){
		$this->shippInfoId = $pShippInfoId;
	}
	
	public function dataSet($subUser,$subPass,$subEmail,$subFname,$subLname,$subAdmin){
			$this->setUserName($subUser);
			$this->setPassword($subPass);
			$this->setEmail($subEmail);
			$this->setFname($subFname);
			$this->setLname($subLname);
			$this->setIsAdmin($subAdmin);
	}
}
?>