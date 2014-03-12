<?php
require_once 'Connection.php';
class InventoryDAO {
	
	public static function getStock($pInvId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT stock FROM inventory WHERE id=?");
		$stmt->bind_param("s",$pInvId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;	
	}
	public static function getSize($pInvId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT size FROM inventory WHERE id=?");
		$stmt->bind_param("s",$pInvId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;			
	}	
	public static function getColor($pInvId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT color FROM inventory WHERE id=?");
		$stmt->bind_param("s",$pInvId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;			
	}
	public static function getDescription($pInvId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT description FROM inventory WHERE id=?");
		$stmt->bind_param("s",$pInvId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;			
	}	
	public static function pushNewInv($pStock, $pSize, $pColor, $pDesc){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("INSERT INTO inventory (stock, size, color, description) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $pStock, $pSize, $pColor, $pDesc);
		$stmt->execute();
		$stmt->fetch();
		
		$invId = $connection->insert_id;
		$dbConnect->closeConnection($connection);
		return $invId;
	}
}
?>