<?php
require_once '../dao/Connection.php';
class ShoppingCart {
	private $cart_name;
	public $items = array();
	
	function __construct($pName){
		$this->cart_name = $pName;
		$this->items = $_SESSION[$this->cart_name];
	}
	function setItemQuantity($pOrderCode, $pQuantity){
		$this->items[$pOrderCode] = $pQuantity;
	}
	function getItemName($pOrderCode, $pType){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT name FROM $pType WHERE id=?");
		$stmt->bind_param("s",$pOrderCode);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		
		$dbConnect->closeConnection($connection);
		return $result;
	}
	function getItemPrice($pOrderCode, $pType){
		$dbConnect = new Connection();
		$connection = $dbConnect->getConnected();
		
		$stmt = $connection->prepare("SELECT price FROM $pType WHERE id=?");
		$stmt->bind_param("s",$pOrderCode);
		$stmt->execute();
		$stmt->bind_result($result);
		$stmt->fetch();
		$roundSult = round($result, 2);
		$dbConnect->closeConnection($connection);
		return $roundSult;
	}
	function getItems(){
		return $this->items;
	}
	function hasItems(){
		return (bool)$this->items;
	}
	function getItemQuantity ($pOrderCode){
		return (int)$this->items[$pOrderCode];
	}
	function clean(){
		$i = 0;
		foreach ($this->items as $orderCode=>$quantity){
			$i++;
			if ($quantity<1){
				unset($this->items[$orderCode]);
				$i--;
			}
		}
		$_SESSION['cartItems'] = $i;
	}
	function save(){
		$this->clean();
		$_SESSION[$this->cart_name] = $this->items;
	}
}