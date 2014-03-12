<?php
	require_once ('../utils/ShoppingCart.php');
	if (!isset($_SESSION['cartItems'])){$_SESSION['cartItems'] = 0; $cartItems = $_SESSION['cartItems'];}else {$cartItems = $_SESSION['cartItems'];}
	session_start();
	$Cart = new ShoppingCart('ecouterCart');
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title>Shopping Cart</title>
		<script src="../cart/js/jquery-1.2.6.pack.js" type="text/javascript"></script>
		<script src="../cart/js/jquery.color.js" type="text/javascript"></script>
		<script src="../cart/js/cart.js" type="text/javascript"></script>
		<link href="../cart/css/cart.css" rel="stylesheet" type="text/css" media="screen" />
	</head>
	<body>
		<div id="container">
			<h1>Shopping Cart</h1>
			<?php if ( $Cart->hasItems() ) : ?>
			<form action="../service/cart_action.php" method="get">
				<table id="cart">
					<tr>
						<th>Quantity</th>
						<th>Item</th>
						<th>Order Code</th>
						<th>Unit Price</th>
						<th>Total</th>
						<th>Remove</th>
					</tr>
					<?php
						$total_price = $i = 0;
						foreach ( $Cart->getItems() as $orderCode=>$quantity ) :
						$patternType ='/\d+/';
						$replacement = '';
						$itemType = preg_replace($patternType, $replacement, $orderCode);
						$total_price += $quantity*$Cart->getItemPrice($orderCode, $itemType);
					?>
						<?php echo $i++%2==0 ? "<tr>" : "<tr class='odd'>"; ?>
							<td class="quantity center"><input type="text" name="quantity[<?php echo $orderCode; ?>]" size="3" value="<?php echo $quantity; ?>" tabindex="<?php echo $i; ?>" /></td>
							<td class="item_name"><?php echo $Cart->getItemName($orderCode, $itemType); ?></td>
							<td class="orderCode"><?php echo $orderCode; ?></td>
							<td class="unit_price">$<?php echo $Cart->getItemPrice($orderCode, $itemType); ?></td>
							<td class="extended_price">$<?php echo ($Cart->getItemPrice($orderCode, $itemType)*$quantity); ?></td>
							<td class="remove center"><input type="checkbox" name="remove[]" value="<?php echo $orderCode; ?>" /></td>
						</tr>
					<?php endforeach; ?>
					<tr><td colspan="4"></td><td id="total_price">$<?php echo $total_price; ?></td></tr>
				</table>
				<input type="submit" name="update" value="Update cart" /><a href="checkout.php" target="_parent">Check Out</a>
			</form>
			<?php else: ?>
				<p class="center">You have no items in your cart.</p>
			<?php endif; ?>
		</div>
	</body>
</html>