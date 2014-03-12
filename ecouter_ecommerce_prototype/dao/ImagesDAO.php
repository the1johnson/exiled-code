<?php
require_once 'Connection.php';
class ImagesDAO {
	
	public static function getFull($pImgId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT full FROM images WHERE id=?");
		$stmt->bind_param("s",$pImgId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;		
	}
	public static function getThumb($pImgId){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT thumb FROM images WHERE id=?");
		$stmt->bind_param("s",$pImgId);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;		
	}
	public static function pushNewImg($pFull, $pThumb){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("INSERT INTO images (full, thumb) VALUES (?, ?)");
		$stmt->bind_param("ss", $pFull, $pThumb);
		$stmt->execute();
		$stmt->fetch();
		
		$imgId = $connection->insert_id;
		$dbConnect->closeConnection($connection);
		return $imgId;
	}
}
?>