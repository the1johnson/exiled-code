<?php
require_once 'Connection.php';
class RecentPurchasesDAO {
	
	public static function getProdOne($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT prod_one FROM recent_purch WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function getProdTwo($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT prod_two FROM recent_purch WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
	public static function getProdThree($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT prod_three FROM recent_purch WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	
}
?>