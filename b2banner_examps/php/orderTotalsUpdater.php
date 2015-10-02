<?php
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
    function calcHardwareCharge( $hardwareData ){
        $hwChargeAmount = 0;
        $dataExplode = explode( ',', $hardwareData );
        
        if( $dataExplode[0] !== 'none' && $dataExplode[0] !== '' ){
            foreach( $dataExplode as $dKey=>$dVal ){
                $dValExplode = explode( ':', $dVal );
                $hwType = $dValExplode[0];
                $hwAmount = intval( $dValExplode[1] );
                
                $hwTypeCost = 0;
                if( $hwType === 'H-Stakes' ){
                    $hwTypeCost = HSTAKECOST*$hwAmount;
                }elseif( $hwType === 'Easels' ){
                    $hwTypeCost = EASELCOST*$hwAmount;
                }elseif( $hwType === 'D-Rings' ){
                    $hwTypeCost = DRINGCOST*$hwAmount;
                }
                
                $hwChargeAmount += $hwTypeCost;
            }
        }
        
        return $hwChargeAmount;
    }
    function orderTotalUpdater( $DB, $clientID, $orderNumber ){
        $sql = 'SELECT b2bitems.*, b2bmaterials.pricingType FROM b2bitems JOIN b2bmaterials ON b2bitems.materialType = b2bmaterials.material AND b2bitems.itemType = b2bmaterials.category WHERE b2bitems.orderNumber = :orderNumber GROUP BY b2bitems.itemID';
        $qvals = array( ':orderNumber'=>$orderNumber );
        $qopts = array();
        $cartItems =  $DB->query( $sql, $qvals, $qopts );
        
        /* TOTAL UP QUANTITES OF MATERIALS TO DETERMINE MATERIALS COST */
        $materialTotals = array();
        foreach( $cartItems as $itemKey=>$item ){
            $itemPricingType = $item['pricingType'];
            $substrate = $item['materialType'];
            $itemAddAmount = ( $itemPricingType === 'rigid' ) ? $item['itemQty'] : ( ($item['width']*$item['height'])/144 )*$item['itemQty'];
        
            if( isset( $materialTotals[ $substrate ] ) ){
                $materialTotals[ $substrate ] += $itemAddAmount;
            }else{
                $materialTotals[ $substrate ] = $itemAddAmount;
            }
        }
        
        $newOrderTotalGoods = 0.00;
        $newOrderTotalGoodsCost = 0.00;
        
        foreach( $cartItems as $item ){
            $itemSubstrate = $item['materialType'];
            $matCateg = $item['itemType'];
            $sql = 'SELECT * FROM b2bmaterials WHERE clientID = :clientID AND material = :material AND category = :category';
            $qvals = array( ':clientID'=>$clientID, ':material'=>$itemSubstrate, ':category'=>$matCateg );
            $chargeMaterials = $DB->query( $sql, $qvals, $qopts );
            $materialInfo = $chargeMaterials[0];
            
            $sql = 'SELECT * FROM b2bmaterials WHERE clientID = :clientID AND material = :material AND category = :category';
            $qvals = array( ':clientID'=>MASTER_CLIENT, ':material'=>$itemSubstrate, ':category'=>$matCateg );
            $chargeMaterials =  $DB->query( $sql, $qvals, $qopts );
            $gbcMaterialInfo = $chargeMaterials[0];
            
            $itemPricingType = $item['pricingType'];
            $itemSQFeet = ( $itemPricingType === 'rigid' ) ? 0 : intval( ( ($item['width']*$item['height'])/144 )*$item['itemQty'] );
            
            $chargedPacking = ( $item['packing'] === 'rolled' && $item['width'] >= 60 && $item['height'] >= 60 ) ? 1 : 0;
            $packingCharge = ( $chargedPacking ) ? ROLLCOST*$item['itemQty'] : 0;
            
            $finishingCharges = calcWebbingCharge( $item['width'], $item['height'], $item['itemQty'], $item['webSides'] )+calcBleedPocketCharge( $item['bleedType'], $item['itemQty'] )+calcBleedPocketCharge( $item['pocketType'], $item['itemQty'] )+$packingCharge;
            $hardwareCharges = calcHardwareCharge( $item['hardwareData'] );
            
            $gbcPriceRange = ($item['printSides'] == '1') ? $gbcMaterialInfo['pricing'] : $gbcMaterialInfo['pricingDblS'];
            $gbcPricePoint = getPricePoint( $itemPricingType, $item['height'], $item['width'], $item['itemQty'], $materialTotals[$itemSubstrate], $gbcPriceRange );
            $itemGbcSubtotal = ( $itemPricingType === 'rigid' ) ? $gbcPricePoint*$item['itemQty'] : $gbcPricePoint*$itemSQFeet;
            $gbcCost = number_format($itemGbcSubtotal, 2, '.', '');
            $itemGbcSubtotal += $finishingCharges + $hardwareCharges;
            $itemGbcSubtotal = number_format($itemGbcSubtotal, 2, '.', '');
            $newOrderTotalGoodsCost += $itemGbcSubtotal;
            
            $priceRange = ($item['printSides'] == '1') ? $materialInfo['pricing'] : $materialInfo['pricingDblS'];
            $pricePoint = getPricePoint( $itemPricingType, $item['height'], $item['width'], $item['itemQty'], $materialTotals[$itemSubstrate], $priceRange );
            $itemSubtotal = ( $itemPricingType === 'rigid' ) ? $pricePoint*$item['itemQty'] : $pricePoint*$itemSQFeet;
            $matCost = number_format($itemSubtotal, 2, '.', '');
            $itemSubtotal += $finishingCharges + $hardwareCharges;
            $itemSubtotal = number_format($itemSubtotal, 2, '.', '');
            $newOrderTotalGoods += $itemSubtotal;
            
            //error_log( "pricePoint:$pricePoint matCost:$matCost finishCost:$finishingCharges hwCost:$hardwareCharges itemiD:".$item['itemID'] );
            
            $sql = 'UPDATE b2bitems SET sqFootPricing = :sqFootPricing, sqFootCost = :sqFootCost, gbcCost = :gbcCost, matCost = :matCost, finCost = :finCost, hwCost = :hwCost WHERE recordID = :recordID';
            $qvals = array( ':sqFootPricing'=>$pricePoint, ':sqFootCost'=>$gbcPricePoint, ':gbcCost'=>$gbcCost, ':matCost'=>$matCost, ':finCost'=>$finishingCharges, ':hwCost'=>$hardwareCharges, ':recordID'=>$item['recordID'] );
            $DB->query( $sql, $qvals, $qopts );
        }
        
        $sql = 'UPDATE b2borders SET orderTotalGoods = :orderTotalGoods, orderTotalGoodsCost = :orderTotalGoodsCost WHERE orderNumber = :orderNumber';
        $qvals = array( ':orderTotalGoods'=>$newOrderTotalGoods, ':orderTotalGoodsCost'=>$newOrderTotalGoodsCost, ':orderNumber'=>$orderNumber );
        $DB->query( $sql, $qvals, $qopts );
    }
?>