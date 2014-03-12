<?php
require_once ('../utils/ShoppingCart.php');
session_start();
$Cart = new ShoppingCart('ecouterCart');
//$itemType = $_SESSION['itemType'];

if ( !empty($_GET['orderCode']) && !empty($_GET['quantity']) ) {
	$quantity = $Cart->getItemQuantity($_GET['orderCode'])+$_GET['quantity'];
	$Cart->setItemQuantity($_GET['orderCode'], $quantity);
}

if ( !empty($_GET['quantity']) ) {
	foreach ( $_GET['quantity'] as $orderCode=>$quantity ) {
		$Cart->setItemQuantity($orderCode, $quantity);
	}
}

if ( !empty($_GET['remove']) ) {
	foreach ( $_GET['remove'] as $orderCode ) {
		$Cart->setItemQuantity($orderCode, 0);
	}
}

$Cart->save();

header('Location: ../view/cart.php');

?>