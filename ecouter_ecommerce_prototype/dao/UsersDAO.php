<?php
require_once 'Connection.php';

class UsersDAO {
	
	public static function checkUser($pUser){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT username FROM users WHERE username=?");
		$stmt->bind_param("s",$pUser);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function checkEmail($pUser){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT email FROM users WHERE username=?");
		$stmt->bind_param("s",$pUser);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
	
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function findEmail($pUser){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT email FROM users WHERE username=?");
		$stmt->bind_param("s",$pUser);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
	
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function checkPassword($pPass){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT password FROM users WHERE password=?");
		$stmt->bind_param("s",$pPass);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
	
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function checkShippId($pUser){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT shipp_info FROM users WHERE username=?");
		$stmt->bind_param("s",$pUser);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function checkAdmin($pUser){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT isAdmin FROM users WHERE username=?");
		$stmt->bind_param("s",$pUser);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function pushUser($pUser, $pPass, $pEmail, $pAdmin){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("INSERT INTO users (username, password, email, isAdmin) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $pUser, $pPass, $pEmail, $pAdmin);
		$stmt->execute();
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
	}
	
	public static function pushShippInfo($pFname, $pLname){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("INSERT INTO shipp_info (f_name, l_name) VALUES (?, ?)");
		$stmt->bind_param("ss", $pFname, $pLname);
		$stmt->execute();
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
	}
	
	public static function updateUsersWshippid($pUser, $pShippId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("UPDATE users SET shipp_info = ? WHERE username = ?");
		$stmt->bind_param("is", $pShippId, $pUser);
		$stmt->execute();
		$stmt->fetch();
		$dbConnect->closeConnection($connection);
	}

}
?>