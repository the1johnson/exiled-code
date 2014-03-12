<?php
$cwd = getcwd();
$cwdSub = substr($cwd, -5, 5);
if($cwdSub=='shoes'){
	require_once 'dao/Connection.php';
	require_once 'dao/ImagesDAO.php';
}else{
	require_once '../dao/Connection.php';
	require_once '../dao/ImagesDAO.php';
}
class Search{
	function __construct()
    {
    	//echo "search class constructed";
    }
    public static function typeSearch($pTable){
    	$img = new ImagesDAO();
    	$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT * FROM $pTable ORDER BY id ASC");
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $name, $summ, $price, $maker, $cate, $invId, $imgId);
		echo "<ul>";
	    while ($stmt->fetch()) {
	    	$imgUrl = $img->getThumb($imgId);
	    	$priceRound = round($price, 2);
	    	$nameUC = ucwords($name);
	    	$cateUC = ucwords($cate);
	    	echo"
            <li class='boxes'>
            <a href='item.php?id=$id&type=$pTable'><img src='$imgUrl'/></a>
            <a href='item.php?id=$id&type=$pTable'><h3 class='home'>$nameUC - $cateUC</h3></a>
            <p class='price'>$$priceRound</p>
            </li>";
	        //echo"lOL... ".$id." ".$name." ".$summ."<br />";
	    }
		echo "</ul>";
		$dbConnect->closeConnection($connection);
		return $stmt;
    }
	public static function categorySearch($pTable, $pWhere){
		$img = new ImagesDAO();
    	$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT * FROM $pTable WHERE category = ?");
		$stmt->bind_param("s",$pWhere);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $name, $summ, $price, $maker, $cate, $invId, $imgId);
		
		echo "<ul>";
	    while ($stmt->fetch()) {
	    	$imgUrl = $img->getThumb($imgId);
	    	$priceRound = round($price, 2);
	    	$nameUC = ucwords($name);
	    	$cateUC = ucwords($cate);
	    	echo"
            <li class='boxes'>
            <a href='item.php?id=$id&type=$pTable'><img src='$imgUrl'/></a>
            <a href='item.php?id=$id&type=$pTable'><h3 class='home'>$nameUC - $cateUC</h3></a>
            <p class='price'>$priceRound</p>
            </li>";
	        //echo"lOL... ".$id." ".$name." ".$summ."<br />";
	    }
		echo "</ul>";
		
		$dbConnect->closeConnection($connection);
		return $stmt;
    }
    public static function fPageSearch($pTable){
    	$img = new ImagesDAO();
    	$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT * FROM $pTable LIMIT 3");
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $name, $summ, $price, $maker, $cate, $invId, $imgId);
		echo "<ul>";
	    while ($stmt->fetch()) {
	    	$badThumb = $img->getThumb($imgId);
	    	$imgUrl = str_replace("../", "", $badThumb);
	    	$priceRound = round($price, 2);
	    	$nameUC = ucwords($name);
	    	$cateUC = ucwords($cate);
	    	echo"
            <li class='boxes'>
            <a href='view/item.php?id=$id&type=$pTable'><img src='$imgUrl'/></a>
            <a href='view/item.php?id=$id&type=$pTable'><h3 class='home'>$nameUC - $cateUC</h3></a>
            <p class='price'>$$priceRound</p>
            </li>";
	        //echo"lOL... ".$id." ".$name." ".$summ."<br />";
	    }
		echo "</ul>";
		$dbConnect->closeConnection($connection);
		return $stmt;
    }
    public static function likeSearch($pTable, $pAgainst){
    	$img = new ImagesDAO();
    	$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		$stmt = $connection->prepare("SELECT * FROM $pTable WHERE MATCH (name,summ) AGAINST(?)");
		$stmt->bind_param("s",$pAgainst);
		$stmt->execute();
		$stmt->store_result();
		$stmt->bind_result($id, $name, $summ, $price, $maker, $cate, $invId, $imgId);
		echo "<ul>";
	    while ($stmt->fetch()) {
	    	$imgUrl = $img->getThumb($imgId);
	    	$priceRound = round($price, 2);
	    	$nameUC = ucwords($name);
	    	$cateUC = ucwords($cate);
	    	echo"
            <li class='boxes'>
            <a href='../view/item.php?id=$id&type=$pTable'><img src='$imgUrl'/></a>
            <a href='../view/item.php?id=$id&type=$pTable'><h3 class='home'>$nameUC - $cateUC</h3></a>
            <p class='price'>$$priceRound</p>
            </li>";
	        //echo"lOL... ".$id." ".$name." ".$summ."<br />";
	    }
		echo "</ul>";
		$dbConnect->closeConnection($connection);
		return $stmt;
    }
}