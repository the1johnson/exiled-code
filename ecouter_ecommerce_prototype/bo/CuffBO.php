<?php
class CuffBO{
	private $name = "";
	private $summ = "";
	private $price = 0;
	private $maker = "";
	private $category = "";
	private $inv_id;
	private $img_id;
	
	public function __construct() {
		//echo "CuffBO Class Constructed <br />";
	}
	
	///////////////////////////////
	////////GETTERS AND SETTERS
	///////////////////////////////
	
	//NAME
	public function getName(){
		return $this->name;
	}
	public function setName($pName){
		$this->name = $pName;
	}
	//SUMMARY
	public function getSumm(){
		return $this->summ;
	}
	public function setSumm($pSumm){
		$this->summ = $pSumm;
	}
	//PRICE
	public function getPrice(){
		return $this->price;
	}
	public function setPrice($pPrice){
		$this->price = $pPrice;
	}
	//MAKER
	public function getMaker(){
		return $this->maker;
	}
	public function setMaker($pMaker){
		$this->maker = $pMaker;
	}
	//CATEGORY
	public function getCategory(){
		return $this->category;
	}
	public function setCategory($pCategory){
		$this->category = $pCategory;
	}
	//INVENTORY ID
	public function getInvId(){
		return $this->inv_id;
	}
	public function setInvId($pInvId){
		$this->inv_id = $pInvId;
	}
	//IMAGE ID
	public function getImgId(){
		return $this->img_id;
	}
	public function setImgId($pImgId){
		$this->img_id = $pImgId;
	}
	
	public function dataSet($subName,$subSumm,$subPrice,$subMaker,$subCategory,$subInvId,$subImgId){
		$this->setName($subName);
		$this->setSumm($subSumm);
		$this->setPrice($subPrice);
		$this->setMaker($subMaker);
		$this->setCategory($subCategory);
		$this->setInvId($subInvId);
		$this->setImgId($subImgId);
	}
}
?>