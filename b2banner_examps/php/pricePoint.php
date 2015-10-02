<?php
    function getPricePoint($itemPricingType, $itemHeight, $itemWidth, $itemQty, $itemTotalSqFt, $itemPrices){
        $pricePoint = 0.00;
        if($itemPricingType === 'rigid'){
            $itemDimSum = $itemHeight+$itemWidth;
            $ranges = explode(';', $itemPrices);
            foreach($ranges as $priceRange){
                $sizePrice = explode(':', $priceRange);
                $size = $sizePrice[0];
                $hWarray = explode('x', $size);
                
                if( $itemDimSum <= ($hWarray[0]+$hWarray[1]) || ($itemDimSum > 144 && ($hWarray[0]+$hWarray[1]) === 144 ) ){
                    $qtyRange = explode(',', $sizePrice[1]);
                    foreach($qtyRange as $qRange){
                        $qtyPrice = explode('=', $qRange);
                        $minMaxQty = explode('-', $qtyPrice[0]);
                        $minQty = intval($minMaxQty[0]);
                        $maxQty = (isset($minMaxQty[1])) ? intval($minMaxQty[1]) : 999999;
                    
                        if($minQty <= $itemQty && $maxQty >= $itemQty){
                            $pricePoint = floatval($qtyPrice[1]);
                            break;
                        }
                    }
                    break;
                }
            }
        }else{
            $ranges = explode(';', $itemPrices);
            
            foreach($ranges as $priceRange){
                $rangeArray = explode(':', $priceRange);
                $sqFtRange = explode('-', $rangeArray[0]);
                $rangeMin = intval($sqFtRange[0]);
                $rangeMax = (count($sqFtRange)>1) ? $sqFtRange[1] : 999999999;
                $pricePerSqFt = floatval($rangeArray[1]);
                
                if($rangeMin <= $itemTotalSqFt && $itemTotalSqFt <= $rangeMax){
                    $pricePoint = $pricePerSqFt;
                    break;
                }
            }
        }
        return $pricePoint;
    }
?>