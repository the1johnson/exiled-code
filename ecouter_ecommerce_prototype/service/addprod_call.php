<?php
require_once '../utils/ImgUpload.php';
require_once '../dao/BeltsDAO.php';
require_once '../dao/CuffsDAO.php';
require_once '../dao/ShoesDAO.php';
require_once '../bo/BeltBO.php';
require_once '../bo/CuffBO.php';
require_once '../bo/ShoeBO.php';
require_once '../dao/InventoryDAO.php';
require_once '../dao/ImagesDAO.php';
require '../utils/upload_config.php';
session_start();

$shoesBo = new ShoeBO();
$beltsBo = new BeltBO();
$cuffsBo = new CuffBO();

$prodType = $_POST['type'];
$prodName = $_POST['prodName'];
$category = $_POST['category'];
$price = floatval($_POST['price']);
$size = $_POST['size'];
$color = $_POST['color'];
$maker = $_POST['maker'];
$summary = $_POST['summary'];
$description = $_POST['description'];
$amount = $_POST['amount'];

if(isset($_FILES['img'])){
	if(preg_match('/[.](jpg)|(gif)|(png)$/', $_FILES['img']['name'])) {  
	    
	    $filename = $_FILES['img']['name'];  
	    $source = $_FILES['img']['tmp_name'];  
	    $target = $path_to_image_directory.$filename; 
	    $thumbTarg = $path_to_thumbs_directory.$filename;
	    
	    move_uploaded_file($source, $target);  
	    
	    ImgUpload::createThumbnail($filename);
    }
}

$invId = InventoryDAO::pushNewInv($amount, $size, $color, $description);
$imgId = ImagesDAO::pushNewImg($target, $thumbTarg);

if ($prodType == 'Shoes'){
	$shoesBo->dataSet($prodName, $summary, $price, $maker, $category, $invId, $imgId);
	ShoesDAO::pushNewShoe($shoesBo->getName(), $shoesBo->getSumm(), $shoesBo->getPrice(), $shoesBo->getMaker(), $shoesBo->getCategory(), $shoesBo->getInvId(), $shoesBo->getImgId());
}elseif ($prodType == 'Belts'){
	$beltsBo->dataSet($prodName, $summary, $price, $maker, $category, $invId, $imgId);
	BeltsDAO::pushNewBelt($beltsBo->getName(), $beltsBo->getSumm(), $beltsBo->getPrice(), $beltsBo->getMaker(), $beltsBo->getCategory(), $beltsBo->getInvId(), $beltsBo->getImgId());
}elseif ($prodType == 'Cuff Links'){
	$cuffsBo->dataSet($prodName, $summary, $price, $maker, $category, $invId, $imgId);
	CuffsDAO::pushNewCuff($cuffsBo->getName(), $cuffsBo->getSumm(), $cuffsBo->getPrice(), $cuffsBo->getMaker(), $cuffsBo->getCategory(), $cuffsBo->getInvId(), $cuffsBo->getImgId());
}
?>