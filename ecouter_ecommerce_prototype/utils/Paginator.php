<?php
class Paginator{
    private $itemsPerPage;
    private $itemsTotal;
    private $currPage;
    private $numPages;
    private $midRange;
    private $low;
    private $high;
    private $limit;
    private $return;
    private $deafultIpp = 25;

    function __construct()
    {
        $this->currPage = 1;
        $this->midRange = 7;
        $this->itemsPerPage = $this->deafultIpp; 
    }
    ///////////////////////////////
	////////GETTERS AND SETTERS
	///////////////////////////////
	
	//ITEMS PER PAGE
	public function getItemsPerPage(){
		return $this->itemsPerPage;
	}
	public function setItemsPerPage($pItemsPerPage){
		$this->itemsPerPage = $pItemsPerPage;
	}
	
	//ITEMS TOTAL
	public function getItemsTotal(){
		return $this->itemsTotal;
	}
	public function setItemsTotal($pItemsTotal){
		$this->itemsTotal = $pItemsTotal;
	}
	
	//CURR PAGE
	public function getCurrPage(){
		return $this->currPage;
	}
	public function setCurrPage($pCurrPage){
		$this->currPage = $pCurrPage;
	}
	
	//NUM PAGES
	public function getNumPages(){
		return $this->numPages;
	}
	public function setNumPages($pNumPages){
		$this->numPages = $pNumPages;
	}
	
	//MID RANGE
	public function getMidRange(){
		return $this->midRange;
	}
	public function setMidRange($pMidRange){
		$this->midRange = $pMidRange;
	}
	
	//LOW
	public function getLow(){
		return $this->low;
	}
	public function setLow($pLow){
		$this->low = $pLow;
	}
	
	//HIGH
	public function getHigh(){
		return $this->high;
	}
	public function setHigh($pHigh){
		$this->high = $pHigh;
	}
	
	//LIMIT
	public function getLimit(){
		return $this->limit;
	}
	public function setLimit($pLimit){
		$this->limit = $pLimit;
	}
	
	//RETURN
	public function getReturn(){
		return $this->return;
	}
	public function setRetrun($pReturn){
		$this->return = $pReturn;
	}
	
	//DEFAULTIPP
	public function getDefaultIpp(){
		return $this->deafultIpp;
	}
	public function setDefaultIpp($pDefaultIpp){
		$this->deafultIpp = $pDefaultIpp;
	}
	
    function paginate($pOnPage, $pIpp)
    {
        if($pIpp == 'All')
        {
            $this->numPages = ceil($this->itemsTotal/$this->deafultIpp);
            $this->itemsPerPage = $this->deafultIpp;
        }
        else
        {
            if(!is_numeric($this->itemsPerPage) OR $this->itemsPerPage <= 0) $this->itemsPerPage = $this->deafultIpp;
            $this->numPages = ceil($this->itemsTotal/$this->itemsPerPage);
        }
        $this->currPage = (int)$pOnPage; // must be numeric > 0
        if($this->currPage < 1 Or !is_numeric($this->currPage)) $this->currPage = 1;
        if($this->currPage > $this->numPages) $this->currPage = $this->numPages;
        $prev_page = $this->currPage-1;
        $next_page = $this->currPage+1;

        if($this->numPages > 10)
        {
            $this->return = ($this->currPage != 1 And $this->itemsTotal >= 10) ? "<a class=\"paginate\" href=\"$_SERVER[PHP_SELF]?page=$prev_page&ipp=$this->itemsPerPage\">« Previous</a> ":"<span class=\"inactive\" href=\"#\">« Previous</span> ";

            $this->start_range = $this->currPage - floor($this->midRange/2);
            $this->end_range = $this->currPage + floor($this->midRange/2);

            if($this->start_range <= 0)
            {
                $this->end_range += abs($this->start_range)+1;
                $this->start_range = 1;
            }
            if($this->end_range > $this->numPages)
            {
                $this->start_range -= $this->end_range-$this->numPages;
                $this->end_range = $this->numPages;
            }
            $this->range = range($this->start_range,$this->end_range);

            for($i=1;$i<=$this->numPages;$i++)
            {
                if($this->range[0] > 2 And $i == $this->range[0]) $this->return .= " ... ";
                // loop through all pages. if first, last, or in range, display
                if($i==1 Or $i==$this->numPages Or in_array($i,$this->range))
                {
                    $this->return .= ($i == $this->currPage And $_GET['page'] != 'All') ? "<a title=\"Go to page $i of $this->numPages\" class=\"current\" href=\"#\">$i</a> ":"<a class=\"paginate\" title=\"Go to page $i of $this->numPages\" href=\"$_SERVER[PHP_SELF]?page=$i&ipp=$this->itemsPerPage\">$i</a> ";
                }
                if($this->range[$this->midRange-1] < $this->numPages-1 And $i == $this->range[$this->midRange-1]) $this->return .= " ... ";
            }
            $this->return .= (($this->currPage != $this->numPages And $this->itemsTotal >= 10) And ($_GET['page'] != 'All')) ? "<a class=\"paginate\" href=\"$_SERVER[PHP_SELF]?page=$next_page&ipp=$this->itemsPerPage\">Next »</a>\n":"<span class=\"inactive\" href=\"#\">» Next</span>\n";
            $this->return .= ($_GET['page'] == 'All') ? "<a class=\"current\" style=\"margin-left:10px\" href=\"#\">All</a> \n":"<a class=\"paginate\" style=\"margin-left:10px\" href=\"$_SERVER[PHP_SELF]?page=1&ipp=All\">All</a> \n";
        }
        else
        {
            for($i=1;$i<=$this->numPages;$i++)
            {
                $this->return .= ($i == $this->currPage) ? "<a class=\"current\" href=\"#\">$i</a> ":"<a class=\"paginate\" href=\"$_SERVER[PHP_SELF]?page=$i&ipp=$this->itemsPerPage\">$i</a> ";
            }
            $this->return .= "<a class=\"paginate\" href=\"$_SERVER[PHP_SELF]?page=1&ipp=All\">All</a> \n";
        }
        $this->low = ($this->currPage-1) * $this->itemsPerPage;
        $this->high = ($pIpp == 'All') ? $this->itemsTotal:($this->currPage * $this->itemsPerPage)-1;
        $this->limit = ($pIpp == 'All') ? "":" LIMIT $this->low,$this->itemsPerPage";
    }

    function display_itemsPerPage()
    {
        $items = '';
        $ipp_array = array(10,25,50,100,'All');
        foreach($ipp_array as $ipp_opt)    $items .= ($ipp_opt == $this->itemsPerPage) ? "<option selected value=\"$ipp_opt\">$ipp_opt</option>\n":"<option value=\"$ipp_opt\">$ipp_opt</option>\n";
        return "<span class=\"paginate\">Items per page:</span><select class=\"paginate\" onchange=\"window.location='$_SERVER[PHP_SELF]?page=1&ipp='+this[this.selectedIndex].value;return false\">$items</select>\n";
    }

    function display_jump_menu()
    {
        for($i=1;$i<=$this->numPages;$i++)
        {
            $option .= ($i==$this->currPage) ? "<option value=\"$i\" selected>$i</option>\n":"<option value=\"$i\">$i</option>\n";
        }
        return "<span class=\"paginate\">Page:</span><select class=\"paginate\" onchange=\"window.location='$_SERVER[PHP_SELF]?page='+this[this.selectedIndex].value+'&ipp=$this->itemsPerPage';return false\">$option</select>\n";
    }

    function display_pages()
    {
        return $this->return;
    }
}
?>
