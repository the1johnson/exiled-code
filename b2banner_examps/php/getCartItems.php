<?php
    session_start();
    require_once( '../utils/config.php' );
    require_once( '../utils/DBConnect.class.php' );
    require_once( '../utils/pricePoint.php' );
    
    function calcWebbingCharge( $height, $width, $itemQty, $sidesFinished ){
        $totalWebbingCost = 0.00;
        $sides = str_split($sidesFinished);
        foreach($sides as $side){
            if($side === 'T' || $side === 'B'){
                $totalWebbingCost += ( ($width/12)*$itemQty )*WEBBINGCOST;
            }elseif($side === 'L' || $side === 'R'){
                $totalWebbingCost += ( ($height/12)*$itemQty )*WEBBINGCOST;
            }
        }
        return number_format($totalWebbingCost, 2);
    }
    function calcBleedPocketCharge( $finishingSize, $itemQty ){
        $sizeBase = 4;
        $chargeSize = intval($finishingSize) - $sizeBase;
        $chargeSize = ( $chargeSize < 0 ) ? 0 : $chargeSize;
        $chargeAmount = ($chargeSize*BLEEDPOCKETCOST)*$itemQty;
        
        return $chargeAmount;
    }
    function sideBooleanToString( $sideBool ){
        $returnStr = '';
        if( isset($sideBool['top']) && $sideBool['top'] ){
            $returnStr .= 'T';
        }
        if( isset($sideBool['left']) && $sideBool['left'] ){
            $returnStr .= 'L';
        }
        if( isset($sideBool['right']) && $sideBool['right'] ){
            $returnStr .= 'R';
        }
        if( isset($sideBool['bottom']) && $sideBool['bottom'] ){
            $returnStr .= 'B';
        }
        
        if( isset($sideBool['topBottom']) && $sideBool['topBottom'] && isset($sideBool['rightLeft']) && $sideBool['rightLeft'] ){
            $returnStr .= 'TLRB';
        }else{
            if( isset($sideBool['topBottom']) && $sideBool['topBottom'] ){
                $returnStr .= 'TB';
            }
            if( isset($sideBool['rightLeft']) && $sideBool['rightLeft'] ){
                $returnStr .= 'RL';
            }
        }
        
        
        $returnStr = ($returnStr === '') ? 'none' : $returnStr;
        return $returnStr;
    }
    
    $DB = new DbConnect();
    $clientID = isset( $_SESSION[ 'loggedInClientID' ] ) ? $_SESSION[ 'loggedInClientID' ] : 'default';
    $loggedUserID = isset( $_SESSION[ 'loggedUserID'] ) ? $_SESSION[ 'loggedUserID'] : 'default';
    $cartHandle = $clientID.'-'.$loggedUserID;
    
    /* GET RAW ITEMS FROM DATABASE */
    $sql = 'SELECT * FROM b2bcart WHERE cartHandle = :cart_handle';
    $qvals = array( ':cart_handle'=>$cartHandle );
    $qopts = array();
    $cartItems =  $DB->query( $sql, $qvals, $qopts );
    
    /* TOTAL UP QUANTITES OF MATERIALS TO DETERMINE MATERIALS COST */
    $materialTotals = array();
    foreach( $cartItems as $itemInfo ){
        $item = unserialize( $itemInfo['cartItem'] );
        $materialInfo = $item['materialObj'];
        $itemPricingType = $materialInfo['pricingType'];
        $substrate = $materialInfo['substrate'];
        $itemAddAmount = ( $itemPricingType === 'rigid' ) ? $item['quantity'] : ( ($item['width']*$item['height'])/144 )*$item['quantity'];
        
        if( isset( $materialTotals[ $substrate ] ) ){
            $materialTotals[ $substrate ] += $itemAddAmount;
        }else{
            $materialTotals[ $substrate ] = $itemAddAmount;
        }
    }
    
    /* TURN RAW ITEM TO PRESENTABLE DATA */
    $cartReturn = array();
    foreach( $cartItems as $itemInfo ){
        $cartID = $itemInfo['recordID'];
        $item = unserialize( $itemInfo['cartItem'] );
        $materialInfo = $item['materialObj'];
        $itemSubstrate = $materialInfo['substrate'];
        $itemPricingType = $materialInfo['pricingType'];
        $itemSQFeet = ( $itemPricingType === 'rigid' ) ? 0 :intval( ( ($item['width']*$item['height'])/144 )*$item['quantity'] );
        $artSides = ($item['sides'] == '1') ? '1 Side':'2 Sides';
        $sideCount = intval($item['sides']);

        /* CHECK FOR CUSTOM PRICE OVERRIDES. If they are there, all finishing and hardware needs to go to zero. Sean wants it that way. It will make tracking profit metrics based on hardware easier by making it impossible */
        $sql = 'SELECT newSubtotal FROM b2bcustompricing WHERE cartID = :cartID';
        $qvals = array( ':cartID'=> $cartID);
        $customPriceRes = $DB->query( $sql, $qvals, $qopts );
        $priceOverride = (isset($customPriceRes[0]) && isset($customPriceRes[0]['newSubtotal'])) ? true : false;


        
        /* TRANSFORM SIDE BOOLEANS TO STRINGS */
        $item['finishing']['polePockets']['sides'] = sideBooleanToString($item['finishing']['polePockets']['sides']);
        $item['finishing']['bleed']['sides'] = sideBooleanToString($item['finishing']['bleed']['sides']);
        $item['finishing']['hem']['sides'] = sideBooleanToString($item['finishing']['hem']['sides']);
        $item['finishing']['grommet']['sides'] = sideBooleanToString($item['finishing']['grommet']['sides']);
        $item['finishing']['webbing']['sides'] = sideBooleanToString($item['finishing']['webbing']['sides']);
        
        /* TALLY UP CHARGES FOR HARDWARE AND FINISHING OPTIONS */
        $chargedPacking = ( $item['packing'] === 'rolled' && $item['width'] >= 60 && $item['height'] >= 60 ) ? 1 : 0;
        $packingCharge = ( $chargedPacking ) ? ROLLCOST*$item['quantity'] : 0;
        $webbingCharge = ( $item['finishing']['webbing']['size'] === 'none' ) ? 0 : calcWebbingCharge( $item['height'], $item['width'], $item['quantity'], $item['finishing']['webbing']['sides'] );
        $bleedCharge = ( $item['finishing']['bleed']['size'] === 'none' ) ? 0 : calcBleedPocketCharge( $item['finishing']['bleed']['size'], $item['quantity'] );
        $pocketCharge = ( $item['finishing']['polePockets']['size'] === 'none' ) ? 0 : calcBleedPocketCharge( $item['finishing']['polePockets']['size'], $item['quantity'] );
        $hstakeCharge = number_format($item['hardware']['hstakes']['count']*HSTAKECOST, 2);
        $easelCharge = number_format($item['hardware']['easels']['count']*EASELCOST, 2);
        $dringCharge = number_format($item['hardware']['drings']['count']*DRINGCOST, 2);
        
        /* SET FINISHING AND HARWARE COSTS */
        $item['finishing']['webbing']['cost'] = ($priceOverride) ? 0 : WEBBINGCOST;
        $item['finishing']['webbing']['charge'] = ($priceOverride) ? 0 : $webbingCharge;
        
        $item['finishing']['polePockets']['cost'] = ($priceOverride) ? 0 : BLEEDPOCKETCOST;
        $item['finishing']['polePockets']['charge'] = ($priceOverride) ? 0 : $pocketCharge;
        
        $item['finishing']['bleed']['cost'] = ($priceOverride) ? 0 : BLEEDPOCKETCOST;
        $item['finishing']['bleed']['charge'] = ($priceOverride) ? 0 : $bleedCharge;
        
        $item['hardware']['hstakes']['cost'] = ($priceOverride) ? 0 : HSTAKECOST;
        $item['hardware']['hstakes']['charge'] = ($priceOverride) ? 0 : $hstakeCharge;
        
        $item['hardware']['easels']['cost'] = ($priceOverride) ? 0 : EASELCOST;
        $item['hardware']['easels']['charge'] = ($priceOverride) ? 0 : $easelCharge;
        
        $item['hardware']['drings']['cost'] = ($priceOverride) ? 0 : DRINGCOST;
        $item['hardware']['drings']['charge'] = ($priceOverride) ? 0 : $dringCharge;
        
        /* SET HOW MUCH GBC CHARAGES MYAAP */
        $sql = 'SELECT * FROM b2bmaterials WHERE clientID = :clientID AND substrate = :substrate';
        $qvals = array( ':clientID'=>$clientID, ':substrate'=>$itemSubstrate );
        $chargeMaterials =  $DB->query( $sql, $qvals, $qopts );
        $chargeMaterialInfo = $chargeMaterials[0];
        $gbcPriceRange = ($item['sides'] == '1') ? $chargeMaterialInfo['pricing'] : $chargeMaterialInfo['pricingDblS'];
        $gbcPricePoint = getPricePoint( $itemPricingType, $item['height'], $item['width'], $item['quantity'], $materialTotals[$itemSubstrate], $gbcPriceRange );
        $itemGbcSubtotal = ( $itemPricingType === 'rigid' ) ? $gbcPricePoint*$item['quantity'] : $gbcPricePoint*$itemSQFeet;
        $gbcCost = $itemGbcSubtotal;
        $itemGbcSubtotal += $packingCharge + $webbingCharge + $bleedCharge + $pocketCharge + $hstakeCharge + $easelCharge + $dringCharge;
        $itemGbcSubtotal = money_format('%i', $itemGbcSubtotal);
        
        $finishingReturn = $item['finishing'];
        $hardWareReturn = $item['hardware'];


        if ($priceOverride === true ) {
            $matCost = floatval($customPriceRes[0]['newSubtotal']);
            $itemSubtotal = money_format('%i', $matCost);
            $pricePoint = round($itemSubtotal / $item['quantity'], 2); //Rigid pricing
            $pricePoint = ( $itemPricingType === 'rigid' ) ? $pricePoint : $pricePoint / $itemSQFeet; 
        } else {
            $priceRange = ($item['sides'] == '1') ? $materialInfo['pricing'] : $materialInfo['pricingDblS'];
            $pricePoint = getPricePoint( $itemPricingType, $item['height'], $item['width'], $item['quantity'], $materialTotals[$itemSubstrate], $priceRange );
            $itemSubtotal = ( $itemPricingType === 'rigid' ) ? $pricePoint*$item['quantity'] : $pricePoint*$itemSQFeet;
            $matCost = $itemSubtotal;
            $itemSubtotal += $packingCharge + $webbingCharge + $bleedCharge + $pocketCharge + $hstakeCharge + $easelCharge + $dringCharge;
            $itemSubtotal = money_format('%i', $itemSubtotal);
        }
        $requestEmail = isset( $item['artRequestEmail'] ) ? $item['artRequestEmail'] : 'none';


        
        //error_log(print_r($item,true));
        $cartReturn[] = array( 'cartID'=>$cartID, 'clientID'=>$clientID, 'category'=>$materialInfo['category'], 'reference'=>$item['itemReference'], 'templateHeight'=>$item['templateHeight'], 'templateWidth'=>$item['templateWidth'], 'substrate'=>$itemSubstrate, 'material'=>$materialInfo['material'], 'size'=>$item['height'].'in x '.$item['width'].'in', 'printHeight'=>$item['height'], 'printWidth'=>$item['width'], 'quantity'=>$item['quantity'], 'sqFeet'=>$itemSQFeet, 'artSides'=>$artSides, 'sideCount'=>$sideCount, 'packing'=>$item['packing'], 'rolledCost'=>ROLLCOST, 'chargedPacking'=>$chargedPacking, 'finish'=>$finishingReturn, 'hardware'=>$hardWareReturn, 'gbcPricePoint'=>$gbcPricePoint, 'pricePoint'=>$pricePoint, 'matCost'=>$matCost, 'gbcCost'=>$gbcCost, 'subTotal'=>$itemSubtotal, 'gbcSubTotal'=>$itemGbcSubtotal, 'artSource'=>$item['artSource'], 'artRequestEmail'=>$requestEmail, 'artFileOne'=>$item['artFileOne'], 'artFileTwo'=>$item['artFileTwo'], 'itemComments'=>$item['itemComments'], 'priceOverride'=>$priceOverride );
    }
    
    //error_log(print_r($cartReturn,true));
    echo json_encode($cartReturn);
?>