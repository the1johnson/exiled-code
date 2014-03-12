<?php
require_once 'Connection.php';
class ShippInfoDAO {
	public static function checkFname($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT f_name FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function checkLname($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT l_name FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function checkPnum($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT p_num FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function checkCity($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT city FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function checkState($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT state FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function checkZip($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT zip FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function checkAddress($pShippId){
		//echo "CHECK USER@!! <br />";
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT address FROM shipp_info WHERE id=?");
		$stmt->bind_param("i",$pShippId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		//echo "value fetched".$result."<br />";
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function getShippId($pFname, $pLname){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT id FROM shipp_info WHERE f_name = ? AND l_name = ?");
		$stmt->bind_param("ss", $pFname, $pLname);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	public static function updateInfo($pFname, $pLname, $pPnum, $pAddress, $pCity, $pState, $pZip, $pId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("UPDATE shipp_info SET f_name=?, l_name=?, p_num=?, city=?, state=?, zip=?, address=? WHERE id=$pId");
		$stmt->bind_param("ssissis", $pFname, $pLname, $pPnum, $pCity, $pState, $pZip, $pAddress);
		$stmt->execute();
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
	}
}
?>