<?php
require_once 'Connection.php';
class ShoesDAO {
	// GET PRODUCT NAME
	public static function getName($pId) {	
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT name FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	// GET PRODUCT SUMMARY
	public static function getSummary($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT summ FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;		

	}
	// GET PRODUCT PRICE
	public static function getPrice($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT price FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;	
	}
	// GET PRODUCT MAKER
	public static function getMaker($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT maker FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;			
	}
	// GET PRODUCT CATAGORY
	public static function getCatagory($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT catagory FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;		
	}
	// GET PRODUCT INVENTORY_ID
	public static function getInvId($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT inv_id FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	// GET PRODUCT IMAGE_ID
	public static function getImgId($pId) {
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT img_id FROM shoes WHERE id=?");
		$stmt->bind_param("s",$pId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;		
	}
	public static function pushNewShoe($pName, $pSumm, $pPrice, $pMaker, $pCateg, $pInvId, $pImgId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("INSERT INTO shoes (name, summ, price, maker, category, inv_id, img_id) VALUES (?, ?, ?, ?, ?, ?, ?)");
		$stmt->bind_param("ssdssii", $pName, $pSumm, $pPrice, $pMaker, $pCateg, $pInvId, $pImgId);
		$stmt->execute();
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
	}
}
?>