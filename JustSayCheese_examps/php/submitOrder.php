<?php
    session_start( );
    require '../globals.php';
    require '../utils/config.php';
    require '../utils/DbConnect.class.php';
    require '../anet_php_sdk/autoload.php';
    require '../phpMailer/PHPMailerAutoload.php';
    
    $uploadsDir = '../../../uploads/';
    $previewsDir = '../../../previews/';
    $ordersDir = '../../../orders/';
    
    function handleImgSrc( $cartItem, $bsapiCharge ){
        global $uploadsDir;
        /* Take orig src and overwrite working file incase it has already been edited */
        $pi = pathinfo( $uploadsDir.$cartItem[ 'imgSrc' ] );
        $origSrc = $pi[ 'filename' ].'_orig.'.$pi[ 'extension' ];
        $bigStockSecret = '4e4acd9a7171fec3600d01339a52673c880551d8';
        $bigStockAccountID = '861826';
        copy( $uploadsDir.$origSrc, $uploadsDir.$cartItem[ 'imgSrc' ] );
    
        if( $cartItem[ 'uploadSrc' ] === 'bigStock' && $bsapiCharge ){
            $bsSrcExplode = explode( '_', $cartItem[ 'imgSrc' ] );
            $bigStockImgID = $bsSrcExplode[0];
            $sizeCode = ( $cartItem[ 'size' ] === '10x10' ) ? 'l' : 'xl';
            $auth_key = sha1($bigStockSecret . $bigStockAccountID . $bigStockImgID);
            
            //TOTALLY NEED A FOR LOOP HERE TO CHARGE MULTIPLE TIMES
            $fields_string = '';
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL, "api.bigstockphoto.com/2/$bigStockAccountID/purchase?image_id=$bigStockImgID&size_code=$sizeCode&auth_key=$auth_key");
            curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
            $bsPurchaseRes = (array) json_decode( curl_exec($ch) );
            curl_close($ch);
        
            $bsDownloadID = $bsPurchaseRes['data']->download_id;
            $auth_key = sha1($bigStockSecret . $bigStockAccountID . $bsDownloadID);
            $ch = curl_init();
            curl_setopt($ch,CURLOPT_URL, "api.bigstockphoto.com/2/$bigStockAccountID/download?auth_key=$auth_key&download_id=$bsDownloadID");
            curl_setopt($ch,CURLOPT_RETURNTRANSFER, 1);
            curl_setopt($ch,CURLOPT_POSTFIELDS, $fields_string);
            $bsDownloadRes = curl_exec($ch);
            curl_close($ch);
        
            file_put_contents( $uploadsDir.$origSrc, $bsDownloadRes );
            file_put_contents( $uploadsDir.$cartItem[ 'imgSrc' ], $bsDownloadRes );
        }
    }
    
    function createOrderPDF( $itemArr ){
        global $uploadsDir, $previewsDir, $ordersDir;
        $editOpts = ( array ) $itemArr[ 'edit' ];
        /* GET UPLOAD FILE PARAMS */
        $fileParams = get_input_params( $uploadsDir.$itemArr[ 'imgSrc' ] );
        $pixPerCmConversion = 2.54;
        if( $fileParams[ 'measureUnit' ] === 'PixelsPerCentimeter' ){
            $fileParams[ 'res' ] = $fileParams[ 'res' ]*$pixPerCmConversion;
        }
        $defaultRes = ( $fileParams[ 'res' ] <= 150 ) ? $fileParams[ 'res' ] : 150;
        $defaultRes = ( $fileParams[ 'res' ] >= 72 ) ? $defaultRes : 72;
        $borderStyle = $itemArr[ 'borderStyle' ];

        //GET THE SIZE OF THE CANVAS AND THE EDIT AREA 
        $sizeAdd = 3.5;
        $resizeSizeAdd = ( $borderStyle === 'wrap' ) ? $sizeAdd : 0.125;
        $sizeSplit = explode( 'x', $itemArr[ 'size' ] );
        $sizeLrg = ( $sizeSplit[ 0 ]>=$sizeSplit[ 1 ] ) ? intval( $sizeSplit[ 0 ] )+$sizeAdd : intval( $sizeSplit[ 1 ] )+$sizeAdd;
        $sizeLrgPx = $sizeLrg*$defaultRes;
        $sizeSm = ( $sizeSplit[ 0 ]>=$sizeSplit[ 1 ] ) ? intval( $sizeSplit[ 1 ] )+$sizeAdd : intval( $sizeSplit[ 0 ] )+$sizeAdd;
        $eaSizeSplit = explode( 'x', $editOpts[ 'editorSize' ] );
        $eaSizeLrg = ( $eaSizeSplit[ 0 ]>=$eaSizeSplit[ 1 ] ) ? intval( $eaSizeSplit[ 0 ] ) : intval( $eaSizeSplit[ 1 ] );
        $positionScale = $sizeLrgPx/$eaSizeLrg;

        $resizeSizeLrg = ( $sizeSplit[ 0 ]>=$sizeSplit[ 1 ] ) ? intval( $sizeSplit[ 0 ] )+$resizeSizeAdd : intval( $sizeSplit[ 1 ] )+$resizeSizeAdd;
        $resizeSizeSm = ( $sizeSplit[ 0 ]>=$sizeSplit[ 1 ] ) ? intval( $sizeSplit[ 1 ] )+$resizeSizeAdd : intval( $sizeSplit[ 0 ] )+$resizeSizeAdd;

        //EDIT THE POSITION VARS TO MATCH THE SCALE OF THE CANVAS
        if( strval( $editOpts[ 'posX' ] )[0] !== '-' && strval( $editOpts[ 'posX' ] )[0] !== '+' ){
            $editOpts[ 'posX' ] = '+'.$editOpts[ 'posX' ];
        }
        if( strval( $editOpts[ 'posY' ] )[0] !== '-' && strval( $editOpts[ 'posY' ] )[0] !== '+' ){
            $editOpts[ 'posY' ] = '+'.$editOpts[ 'posY' ];
        }

        $tStr = strval( $editOpts[ 'posX' ] );
        $oper = $tStr[0];
        $oper = ( $oper === '+' ) ? '-' : '+';
        $tStr = floatval( substr( $tStr, 1 ) )*$positionScale;
        $editOpts[ 'posX' ] = $oper.$tStr;

        $tStr = strval( $editOpts[ 'posY' ] );
        $oper = $tStr[0];
        $oper = ( $oper === '+' ) ? '-' : '+';
        $tStr = floatval( substr( $tStr, 1 ) )*$positionScale;
        $editOpts[ 'posY' ] = $oper.$tStr;

        //CONVERT THE FILE TO CANVAS SIZE
        $pixHeight = ( $itemArr[ 'orientation' ] === 'horiz' ) ? intval($sizeSm*$defaultRes) : intval($sizeLrg*$defaultRes);
        $pixWidth = ( $itemArr[ 'orientation' ] === 'horiz' ) ? intval($sizeLrg*$defaultRes) : intval($sizeSm*$defaultRes);
        $resizePixHeight = ( $itemArr[ 'orientation' ] === 'horiz' ) ? intval($resizeSizeSm*$defaultRes) : intval($resizeSizeLrg*$defaultRes);
        $resizePixWidth = ( $itemArr[ 'orientation' ] === 'horiz' ) ? intval($resizeSizeLrg*$defaultRes) : intval($resizeSizeSm*$defaultRes);
        $sizeScale = floatval($editOpts[ 'scale' ])/100;
        
        if( $borderStyle === 'black' ){
            $bgColor = '#000000';
        }else if( $borderStyle === 'alzPurple' ){
            $bgColor = '#653a90';
        }else{
            $bgColor = '#ffffff';
        }
        
        $backgroundColor = ( $borderStyle === 'wrap' ) ? '' : ' -background "'.$bgColor.'"';
        $imgResize = '';
        if( $itemArr[ 'sizeby' ] === 'height' && $itemArr[ 'orientation' ] === 'horiz' ){
            $imgResize = 'x'.intval(( $resizeSizeSm*$sizeScale )*$defaultRes);
        }elseif( $itemArr[ 'sizeby' ] === 'height' && $itemArr[ 'orientation' ] === 'vert' ){
            $imgResize = 'x'.intval(( $resizeSizeLrg*$sizeScale )*$defaultRes);
        }elseif( $itemArr[ 'sizeby' ] === 'width' && $itemArr[ 'orientation' ] === 'horiz' ){
            $imgResize = intval(( $resizeSizeLrg*$sizeScale )*$defaultRes).'x';
        }elseif( $itemArr[ 'sizeby' ] === 'width' && $itemArr[ 'orientation' ] === 'vert' ){
            $imgResize = intval(( $resizeSizeSm*$sizeScale )*$defaultRes).'x';
        }
        
        if( $fileParams[ 'measureUnit' ] === 'PixelsPerCentimeter' ){
            $defaultRes = $defaultRes/$pixPerCmConversion;
        }
        $output;
        $return;
        $cmd = IMAGEMAGICK_CONVERT.$uploadsDir.$itemArr[ 'imgSrc' ].' -density '.$defaultRes.'x'.$defaultRes.' -resize '.$imgResize.' -crop '.$resizePixWidth.'x'.$resizePixHeight.$editOpts[ 'posX' ].$editOpts[ 'posY' ].' -quality 100 '.$uploadsDir.$itemArr[ 'imgSrc' ];
        exec( $cmd, $output, $return );
        
        $cmd = IMAGEMAGICK_CONVERT.$uploadsDir.$itemArr[ 'imgSrc' ].$backgroundColor.' -gravity center -extent '.$pixWidth.'x'.$pixHeight.' -quality 100 '.$uploadsDir.$itemArr[ 'imgSrc' ];
        exec( $cmd, $output, $return );
        
        //CREATE PREVIEW
        $previewOverlayDir = '../../img/previewOverlays/';
        $colorBorderTag = ( $borderStyle === 'black' ) ? '-white' : '';
        $overlayLoc = ( $itemArr[ 'size' ] === '10x10' ) ? $previewOverlayDir.$itemArr[ 'size' ].$colorBorderTag.'.png' : $previewOverlayDir.$itemArr[ 'size' ].'-'.$itemArr[ 'orientation' ].$colorBorderTag.'.png';
        $prevSrcExplode = explode( '.', $itemArr[ 'imgSrc' ]);
        $prevSrcFtype = $prevSrcExplode[ count($prevSrcExplode)-1 ];
        $previewSize = 200;
        $previewDpi = 72;
        $prevResize = ( $itemArr[ 'orientation' ] === 'horiz' ) ? $previewSize.'x' : 'x'.$previewSize;
        $cmd = IMAGEMAGICK_CONVERT.$uploadsDir.$itemArr[ 'imgSrc' ].' -resize '.$prevResize.' -quality 100 -density '.$previewDpi.'x'.$previewDpi.' '.$previewsDir.$itemArr[ 'itemOrderID' ].'.'.$prevSrcFtype;
        exec( $cmd );
        /* create pdf */
        $cmd = IMAGEMAGICK_CONVERT.$uploadsDir.$itemArr[ 'imgSrc' ].' -quality 100 '.$ordersDir.$itemArr[ 'itemOrderID' ].'.pdf';
        exec( $cmd );
    }

    function failedTrans( $DB, $orderNumber ){
        $qopts = array();
        $sql = "DELETE FROM jscorderitems WHERE orderNumber = :orderNumber";
        $qvals = array( ':orderNumber'=>$orderNumber );
        $DB->query( $sql, $qvals, $qopts );
        $sql = "DELETE FROM jscorders WHERE orderNumber = :orderNumber";
        $DB->query( $sql, $qvals, $qopts );
    }

    $shipMethod = 'upsgnd'; //Only 1 ship method
    $groupingNameList = array( 'grouping-1'=>'bigCheeseFlight', 'grouping-2'=>'ninePack', 'grouping-3'=>'3-32x48s', 'grouping-4'=>'3-16x48s', 'grouping-5'=>'3-22x38s', 'grouping-6'=>'3-16x20s', 'grouping-7'=>'3-10x10s' );
    
    $mailerOpts = getMailerOpts();
    $mail = new PHPMailer;
    $mail->isSMTP();
    $mail->Host = $mailerOpts[ 'host' ];
    $mail->SMTPAuth = true;
    $mail->Username = $mailerOpts[ 'username' ];
    $mail->Password = $mailerOpts[ 'password' ];
    $mail->SMTPSecure = 'ssl';
    $mail->Port = 465;
    $mail->From = $mailerOpts[ 'from' ];
    $mail->FromName = $mailerOpts[ 'fromName' ];
    
    $DB = new DbConnect();
    $qopts = array();
    $shippingAddrData = (array) json_decode( $_POST[ 'shippingAddrData' ] );
    $billingAddrData = (array) json_decode( $_POST[ 'billingAddrData' ] );
    $paymentData = (array) json_decode( $_POST[ 'paymentData' ] );
    
    
    
    $orderTotalSH = isset( $_SESSION[ 'orderTotalSH' ] ) ? $_SESSION[ 'orderTotalSH' ] : 0;
    $extraShipping = isset( $_SESSION[ 'extraShipping' ] ) ? $_SESSION[ 'extraShipping' ] : 0;
    $discount = isset( $_SESSION[ 'discount' ] ) ? $_SESSION[ 'discount' ] : 0;
    $promoCode = isset( $_SESSION[ 'promoCode' ] ) ? $_SESSION[ 'promoCode' ] : '';
    $donation = isset( $_SESSION[ 'donation' ] ) ? $_SESSION[ 'donation' ] : 0;
    $totalCalcedOnIndex = isset( $_SESSION[ 'indexTotal' ] ) ? $_SESSION[ 'indexTotal' ] : 0;
    unset( $_SESSION[ 'indexTotal' ] );
    $m = $paymentData[ 'expireMonth' ];
    $y = substr($paymentData[ 'expireYear' ], 2);
    $expDate = (strlen($m) !== 2) ? "0".$m.$y : $m.$y;

    $cartHandle = getCartHandle();
    $now = date( 'Y-m-j' );
    
    /* grab the cart items*/
    $sql = "SELECT * FROM jsccart WHERE cartHandle = :cartHandle AND itemType <> :itemType";
    $qvals = array( ':cartHandle'=>$cartHandle, ':itemType'=>'promo' );
    $cartRes =  $DB->query( $sql, $qvals, $qopts );
    $itemCount = count($cartRes);
    $itemNumber = 1;
    
    /* handle empty cart issue */
    if( $itemCount === 0 ){
        echo 'Please refresh your browser';
        exit();
    }
    
    /* GRAB THE SUBMITTING USER */
    $b2bUserlist = array( 'wbo', 'hpb', 'biggies', 'sbg' );
    $userID = isset( $_SESSION[ 'userID' ] ) ? $_SESSION[ 'userID' ] : '0';
    $sql = "SELECT * FROM jscusers WHERE userID = :userID";
    $qvals = array( ':userID'=>$userID );
    $qopts = array();
    $userRes = $DB->query( $sql, $qvals, $qopts );
    
    
    //Handle free checkout (no email)
    $userEmail = (isset($billingAddrData[ 'billingEmail' ]) && $billingAddrData[ 'billingEmail' ]) ? $billingAddrData[ 'billingEmail' ] : $userRes[0]['email'];
    $mail->addAddress( $userEmail );

    $userInfo = (count( $userRes )) ? $userRes[ 0 ] : array( 'nickname'=>'guest', 'shiptoFirstName'=>'', 'shiptoLastName'=>'', 'shiptoAddress1'=>'', 'shiptoAddress2'=>'', 'shiptoCity'=>'', 'shiptoState'=>'', 'shiptoZipcode'=>'', 'billingFirstName'=>'', 'billingLastName'=>'', 'billingAddress1'=>'', 'billingAddress2'=>'', 'billingCity'=>'', 'billingState'=>'', 'billingZipcode'=>'', 'billingPhone'=>'', 'billingEmail'=>'' );
    $clientID = $userInfo[ 'nickname' ];
    
    $isB2B = in_array( $clientID, $b2bUserlist );
    $xmlAPP = ($isB2B) ? 'b2b' : 'jsc';
    $xmlLogo = ($isB2B) ? $clientID : 'jsc';

    
    /* create the order */
    $sql = ($isB2B) ? 'INSERT INTO b2borders(orderStatus, clientID, contactEmail, whenFirstApproved, shiptoAttention, orderTotalSH' : 'INSERT INTO jscorders(orderStatus, clientID, userID, contactEmail, whenFirstApproved, shiptoAttention, orderTotalSH, promoCode, discount';
    $valStr = ($isB2B) ? ':orderStatus, :clientID, :contactEmail, :whenFirstApproved, :shiptoAttention, :orderTotalSH' : ':orderStatus, :clientID, :userID, :contactEmail, :whenFirstApproved, :shiptoAttention, :orderTotalSH, :promoCode, :discount';
    $shipAttn = $shippingAddrData[ 'shiptoFirstName' ].' '.$shippingAddrData[ 'shiptoLastName' ];
    $qvals = ($isB2B) ? array( ':orderStatus'=>'underway', ':clientID'=>$clientID, ':contactEmail'=>$userEmail, ':whenFirstApproved'=>$now, ':shiptoAttention'=>$shipAttn, ':orderTotalSH'=>$orderTotalSH ) : array( ':orderStatus'=>'underway', ':clientID'=>$clientID, ':userID'=>$userID, ':contactEmail'=>$userEmail, ':whenFirstApproved'=>$now, ':shiptoAttention'=>$shipAttn, ':orderTotalSH'=>$orderTotalSH, ':promoCode'=>$promoCode, ':discount'=>$discount );
    unset( $shippingAddrData[ 'shiptoEmail' ] ); unset( $shippingAddrData[ 'shiptoPhone' ]); //Get rid of js tracked stuff
    if($isB2B){
        unset($shippingAddrData[ 'shiptoFirstName' ]);
        unset($shippingAddrData[ 'shiptoLastName' ]);
    }else{
        foreach( $billingAddrData as $key=>$val ){
            $qKey = ':'.$key;
            $qvals[ $qKey ] = $val;
        
            $sql .= ', '.$key;
            $valStr .= ', '.$qKey;
        }
    }
    foreach( $shippingAddrData as $key=>$val ){
        $qKey = ':'.$key;
        $qvals[ $qKey ] = $val;
        
        $sql .= ', '.$key;
        $valStr .= ', '.$qKey;
    }

    $sql .= ') VALUES('.$valStr.')';
    //error_log('isB2b: '.$isB2B.' SQL: '.$sql);
    $orderNumber =  $DB->query( $sql, $qvals, $qopts );

    //Take order number, make hex, swap last 2 digits to look like it increases by 15 every time.
    $g = strval(dechex($orderNumber*rand(1,5)));$e = substr($g, -1, 1);$m = substr($g, -2, 1);
    $s = substr($g, 0, strlen($g)-2);$shownOrderNum = 'jsc'.$s.$e.$m;


    /* HIAK test and add*/
    $HIAK = ['HI', 'AK'];
    foreach ( $HIAK as $state ) {
        if ( $shippingAddrData[ 'shiptoState' ] === $state ) {
            $orderTotalSH += $extraShipping;
            break;
        }
    }  
    
    /* ship deadline info */
    $shipMethod = $paymentData[ 'shipMethod' ];
    $today = time();
    $shipDeadline = date( 'Y-m-d H:i:s', strtotime( addWorkingDays( $today, 4 ) ) );
    
    /* start auth.net Advanced Integration Method */
    $authNet = new AuthorizeNetAIM;
    $orderTotalGoods = 0.00;
    $orderTotalGoodsCost = 0.00;
    $shipHandling = $orderTotalSH;
    
    /* go through each cart item and create an xml file
        also convert the upload file to a pdf and put it in the orders folder with the xml
        also add a authnet line item for each order item */
    $mail->AddEmbeddedImage('../../img/emailLogo.png', 'jscLogo');
    $mail->AddEmbeddedImage('../../img/emailOrderMore.png', 'jscOrderMore');
    $emailMsg = 'Hey '.$billingAddrData[ 'billingFirstName' ].'!<br/><br/>'.
            '<p>Thanks so much for joining the canvas revolution and placing an order with Just Say Cheese. Your order is rockin&#39; &amp; rollin&#39; through our facility and we are working hard to get your d&#233;KORE&#8482; to you in record time!</p>'.
            '<p>To check the status of your order, please log into your account and view your order history. UPS tracking information will also be emailed to you once your package leaves our facility.</p>'.
            '<p>If you have any questions whatsoever, please contact us at <a href="mailto:support@justsaycheese.com?subject=Just%20Say%20Cheese%20Support%20Email">support@justsaycheese.com</a>; we are here to help.</p>'.
            '<p>Thanks again!</p>'.
            '<p><a href="https://justsaycheese.com?pg=home" target="_blank"><img src="cid:jscLogo" /></a></p>'.
            '<table border="0" cellpadding="0" cellspacing="0" width="100%">
          <tr style="background-color: #ababab; color: white;"><td style="padding: 5px 10px 5px 10px;">Order Information</td></tr>
          <tr>
              <td style="padding: 5px 10px 5px 10px;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr><td width="200">Merchant:</td><td>MYAAP - Manage Your Assets And Print</td></tr>
                      <tr><td width="200">Description:</td><td>Just Say Cheese Order</td></tr>
                      <tr><td width="200">Invoice Number:</td><td>'.$shownOrderNum.'</td></tr>
                      <tr><td width="200">Customer ID:</td><td>'.$userID.'</td></tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style="padding: 5px 10px 5px 10px; border-top: 1px solid black; border-bottom: 1px solid black;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                          <td width="200"><strong>Billing Information</strong></td>
                          <td><strong>Shipping Information</strong></td>
                      </tr>
                      <tr>
                          <td>'.$billingAddrData[ 'billingFirstName' ].' '.$billingAddrData[ 'billingLastName' ].'</td>
                          <td>'.$shippingAddrData[ 'shiptoFirstName' ].' '.$shippingAddrData[ 'shiptoLastName' ].'</td>
                      </tr>
                      <tr>
                          <td>'.$billingAddrData[ 'billingAddress1' ].' '.$billingAddrData[ 'billingAddress2' ].'</td>
                          <td>'.$shippingAddrData[ 'shiptoAddress1' ].' '.$shippingAddrData[ 'shiptoAddress2' ].'</td>
                      </tr>
                      <tr>
                          <td>'.$billingAddrData[ 'billingCity' ].', '.$billingAddrData[ 'billingState' ].' '.$billingAddrData[ 'billingZipcode' ].'</td>
                          <td>'.$shippingAddrData[ 'shiptoCity' ].', '.$shippingAddrData[ 'shiptoState' ].' '.$shippingAddrData[ 'shiptoZipcode' ].'</td>
                      </tr>
                      <tr>
                          <td>US</td>
                          <td>US</td>
                      </tr>
                      <tr>
                          <td>'.$billingAddrData[ 'billingEmail' ].'</td>
                          <td></td>
                      </tr>
                      <tr>
                          <td>'.$billingAddrData[ 'billingPhone' ].'</td>
                          <td></td>
                      </tr>
                  </table>
              </td>
          </tr>
          <tr>
              <td style="padding: 5px 10px 5px 10px; border-bottom: 1px solid black;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%">
                      <tr>
                          <td><strong>Item</strong></td>
                          <td><strong>Description</strong></td>
                          <td><strong>QTY</strong></td>
                          <td><strong>Unit Price</strong></td>
                          <td><strong>Stock Image Price</strong></td>
                          <td><strong>Item Total</strong></td>
                      </tr>';
    $xmlElems = array();
    $orderStockCount = 0;
    $bigStockCharge = 0;
    foreach( $cartRes as $cartResKey=>$itemInfo ){
        $recordID = $itemInfo[ 'recordID' ];
        $cartItem;
        if( $itemInfo[ 'itemType' ] === 'product' ){
            $cartItem = (array) json_decode( $itemInfo[ 'cartItem' ] );
            $orientation = ( $cartItem[ 'orientation' ] === 'horiz' ) ? 'landscape' : 'portrait';
            $itemID = $orderNumber.'_'.$itemNumber;
            $shownItemID = $shownOrderNum.'_'.$itemNumber;
            $xmlCapt = htmlspecialchars($cartItem[ 'caption' ]);
            
            /* add item id to cartRes */
            $cartItem[ 'itemOrderID' ] = $itemID;
            $ciJSON = json_encode( $cartItem );
            $cartRes[$cartResKey]['cartItem'] = $ciJSON;
            
            /* add item xml to object to create on success */
            $xml = new SimpleXMLElement('<xml/>');
            $job = $xml->addChild( 'job' );
            $job->addChild( 'orderNumber', $orderNumber );
            $job->addChild( 'shownOrderNum', $shownOrderNum );
            $job->addChild( 'itemNumber', $itemNumber );
            $job->addChild( 'size', $cartItem[ 'size' ] );
            $job->addChild( 'orientation', $orientation );
            $job->addChild( 'caption', "$xmlCapt" );
            $job->addChild( 'quantity', $cartItem[ 'quantity' ] );
            $job->addChild( 'itemCount', $itemCount );
            $job->addChild( 'shipDate', substr( $shipDeadline, 0 , -9 ) );
            $job->addChild( 'approved', $now );
            $job->addChild( 'logo', $xmlLogo );
        
            $job->addChild( 'app', $xmlAPP );
            $xmlElems[ $itemID ] = $xml;
            //$xml->asXML( $ordersDir.$itemID.'.xml' );
        
            /* grab the material for its gbc price */
            $sql = "SELECT gbcCost FROM jscmaterials WHERE size = :size";
            $qvals = array( ':size'=>$cartItem[ 'size' ] );
            $qopts = array();
            $matRes =  $DB->query( $sql, $qvals, $qopts );
            $mat = $matRes[ 0 ];
        
            $sizeExpl = explode( 'x', $cartItem[ 'size' ] );
            $lrgSize = ( intval( $sizeExpl[0] )>intval( $sizeExpl[1] ) ) ? intval( $sizeExpl[0] ) : intval( $sizeExpl[1] );
            $smSize = ( intval( $sizeExpl[0] )>intval( $sizeExpl[1] ) ) ? intval( $sizeExpl[1] ) : intval( $sizeExpl[0] );
            $canvasHeight = ( $cartItem[ 'orientation' ] === 'horiz' ) ? $smSize : $lrgSize;
            $canvasWidth = ( $cartItem[ 'orientation' ] === 'horiz' ) ? $lrgSize : $smSize;
        
            $itemQty = intval( $cartItem[ 'quantity' ] );
            $orderTotalGoods += number_format( floatval($cartItem[ 'price' ])*$itemQty, 2 );
            $orderTotalGoodsCost += number_format( $mat[ 'gbcCost' ]*$itemQty, 2 );
            $itemShipMethod = ( ($shippingAddrData[ 'shiptoState' ] === 'HI' || $shippingAddrData[ 'shiptoState' ] === 'AK') && ($cartItem[ 'size' ] !== '10x10' && $cartItem[ 'size' ] !== '16x20') ) ? 'ups2day' : $shipMethod;
            /* INSERT INTO ITEMS TABLE */
            $sql = ($isB2B) ? "INSERT INTO b2bitems(orderNumber, itemNumber, itemID, itemStatus, itemQty, width, height, artFile1, shipMethod, shipDeadline, matCost, gbcCost) VALUES(:orderNumber, :itemNumber, :itemID, :itemStatus, :itemQty, :width, :height, :artFile, :shipMethod, :shipDeadline, :itemCost, :gbcCost)" : "INSERT INTO jscorderitems(orderNumber, itemNumber, itemID, itemStatus, itemQty, width, height, artFile, uploadSrc, shipMethod, shipDeadline, itemCost, gbcCost, caption) VALUES(:orderNumber, :itemNumber, :itemID, :itemStatus, :itemQty, :width, :height, :artFile, :uploadSrc, :shipMethod, :shipDeadline, :itemCost, :gbcCost, :caption)";
            
            $qvals = ($isB2B) ? array( ':orderNumber'=>$orderNumber, ':itemNumber'=>$itemNumber, ':itemID'=>$itemID, ':itemStatus'=>'approved', ':itemQty'=>$itemQty, ':width'=>$canvasWidth, ':height'=>$canvasHeight, ':artFile'=>HTTP_SERVER.'/uploads/'.$cartItem[ 'imgSrc' ], ':shipMethod'=>$itemShipMethod, ':shipDeadline'=>$shipDeadline, ':itemCost'=>$cartItem[ 'price' ], ':gbcCost'=>$mat[ 'gbcCost' ] ) : array( ':orderNumber'=>$orderNumber, ':itemNumber'=>$itemNumber, ':itemID'=>$itemID, ':itemStatus'=>'approved', ':itemQty'=>$itemQty, ':width'=>$canvasWidth, ':height'=>$canvasHeight, ':artFile'=>$cartItem[ 'imgSrc' ], ':uploadSrc'=>$cartItem[ 'uploadSrc' ], ':shipMethod'=>$itemShipMethod, ':shipDeadline'=>$shipDeadline, ':itemCost'=>$cartItem[ 'price' ], ':gbcCost'=>$mat[ 'gbcCost' ], ':caption'=>$cartItem[ 'caption' ] );
            
            $insertRes =  $DB->query( $sql, $qvals, $qopts );
        
            $itemStockCount = 0;
            
            if( $cartItem[ 'uploadSrc' ] === 'bigStock' ){
                $itemStockCount = $itemQty;
                $orderStockCount += $itemQty;
                $orderTotalGoods += $itemStockCount*BIG_STOCK_COST;
                $bigStockCharge += $itemStockCount*BIG_STOCK_COST;
            }
            
            $siTD = ( $itemStockCount ) ? number_format( BIG_STOCK_COST, 2 ) : 0.00;
            $itTD = ( $itemStockCount ) ? number_format( (floatval($cartItem[ 'price' ])+BIG_STOCK_COST )*$itemQty, 2 ) : number_format( floatval($cartItem[ 'price' ])*$itemQty, 2 );
            
            $authNet->addLineItem($itemID, 'DeKORE', $cartItem[ 'size' ], $cartItem[ 'quantity' ], $cartItem[ 'price' ], 'N');
            
            $emailMsg .= '<tr>
                              <td>'.$shownItemID.'</td>
                              <td>D&#233;KORE '.$cartItem[ 'size' ].'</td>
                              <td>'.$cartItem[ 'quantity' ].'</td>
                              <td>US $'.number_format( $cartItem[ 'price' ], 2 ).'</td>
                              <td>US $'.$siTD.'</td>
                              <td>US $'.$itTD.'</td>
                          </tr>';
                          
            $itemNumber++;
        }elseif( $itemInfo[ 'itemType' ] === 'grouping' || $itemInfo[ 'itemType' ] === 'split' ){
            $groupingArray = unserialize( $itemInfo[ 'cartItem' ] );
            
            $itemStockCount = 0;
            $groupingQty = 1;
            $groupingPrice = 0.00;
            $groupingName = '';
            $splitStockCharged = 0;
            foreach( $groupingArray as $groupingItemKey=>$groupingItem ){
                $cartItem = (array) $groupingItem->item;
                $orientation = ( $cartItem[ 'orientation' ] === 'horiz' ) ? 'landscape' : 'portrait';
                $itemID = $orderNumber.'_'.$itemNumber;
                $shownItemID = $shownOrderNum.'_'.$itemNumber;
                $xmlCapt = htmlspecialchars($cartItem[ 'caption' ]);
                $groupingName = $groupingNameList[ $cartItem['grouping'] ];
                
                $xml = new SimpleXMLElement('<xml/>');
                $job = $xml->addChild( 'job' );
                $job->addChild( 'orderNumber', $orderNumber );
                $job->addChild( 'shownOrderNum', $shownOrderNum );
                $job->addChild( 'itemNumber', $itemNumber );
                $job->addChild( 'size', $cartItem[ 'size' ] );
                $job->addChild( 'orientation', $orientation );
                $job->addChild( 'caption', "$xmlCapt" );
                $job->addChild( 'quantity', $cartItem[ 'quantity' ] );
                $job->addChild( 'itemCount', $itemCount );
                $job->addChild( 'shipDate', substr( $shipDeadline, 0 , -9 ) );
                $job->addChild( 'approved', $now );
                $job->addChild( 'logo', $xmlLogo );
                $job->addChild( 'app', $xmlAPP );
                $xmlElems[ $itemID ] = $xml;
                
                try {
                    $groupingArray[$groupingItemKey]->item->itemOrderID = $itemID;
                } catch (Exception $e) {
                    error_log("grouping error - ".$e);
                    error_log(print_r($groupingArray));
                }
                        
                /* grab the material for its gbc price */
                $sql = "SELECT gbcCost FROM jscmaterials WHERE size = :size";
                $qvals = array( ':size'=>$cartItem[ 'size' ] );
                $qopts = array();
                $matRes =  $DB->query( $sql, $qvals, $qopts );
                $mat = $matRes[ 0 ];
                
                $sizeExpl = explode( 'x', $cartItem[ 'size' ] );
                $lrgSize = ( intval( $sizeExpl[0] )>intval( $sizeExpl[1] ) ) ? intval( $sizeExpl[0] ) : intval( $sizeExpl[1] );
                $smSize = ( intval( $sizeExpl[0] )>intval( $sizeExpl[1] ) ) ? intval( $sizeExpl[1] ) : intval( $sizeExpl[0] );
                $canvasHeight = ( $cartItem[ 'orientation' ] === 'horiz' ) ? $smSize : $lrgSize;
                $canvasWidth = ( $cartItem[ 'orientation' ] === 'horiz' ) ? $lrgSize : $smSize;
                
                $itemQty = intval( $cartItem[ 'quantity' ] );
                $groupingQty = $itemQty;
                $groupingPrice = $cartItem[ 'price' ];
                $orderTotalGoodsCost += number_format( $mat[ 'gbcCost' ]*$itemQty, 2 );
                /* INSERT INTO ITEMS TABLE */
                $sql = ($isB2B) ?  "INSERT INTO jscorderitems(orderNumber, itemNumber, itemID, itemStatus, itemQty, width, height, artFile, shipMethod, shipDeadline, itemCost, gbcCost) VALUES(:orderNumber, :itemNumber, :itemID, :itemStatus, :itemQty, :width, :height, :artFile, :shipMethod, :shipDeadline, :itemCost, :gbcCost)" : "INSERT INTO jscorderitems(orderNumber, itemNumber, itemID, itemStatus, itemQty, width, height, artFile, uploadSrc, shipMethod, shipDeadline, itemCost, gbcCost, caption) VALUES(:orderNumber, :itemNumber, :itemID, :itemStatus, :itemQty, :width, :height, :artFile, :uploadSrc, :shipMethod, :shipDeadline, :itemCost, :gbcCost, :caption)";
                $qvals = ($isB2B) ? array( ':orderNumber'=>$orderNumber, ':itemNumber'=>$itemNumber, ':itemID'=>$itemID, ':itemStatus'=>'approved', ':itemQty'=>$itemQty, ':width'=>$canvasWidth, ':height'=>$canvasHeight, ':artFile'=>$cartItem[ 'imgSrc' ], ':shipMethod'=>$shipMethod, ':shipDeadline'=>$shipDeadline, ':itemCost'=>$cartItem[ 'price' ], ':gbcCost'=>$mat[ 'gbcCost' ] ) : array( ':orderNumber'=>$orderNumber, ':itemNumber'=>$itemNumber, ':itemID'=>$itemID, ':itemStatus'=>'approved', ':itemQty'=>$itemQty, ':width'=>$canvasWidth, ':height'=>$canvasHeight, ':artFile'=>$cartItem[ 'imgSrc' ], ':uploadSrc'=>$cartItem[ 'uploadSrc' ], ':shipMethod'=>$shipMethod, ':shipDeadline'=>$shipDeadline, ':itemCost'=>$cartItem[ 'price' ], ':gbcCost'=>$mat[ 'gbcCost' ], ':caption'=>$cartItem[ 'caption' ] );
                $insertRes =  $DB->query( $sql, $qvals, $qopts );
                
                if( $cartItem[ 'uploadSrc' ] === 'bigStock' && !$splitStockCharged ){
                    $splitStockCharged = ( $itemInfo[ 'itemType' ] === 'split' ) ? 1 : 0;
                    $itemStockCount = $itemQty;
                    $orderStockCount += $itemQty;
                    $orderTotalGoods += $itemStockCount*BIG_STOCK_COST;
                    $bigStockCharge += $itemStockCount*BIG_STOCK_COST;
                }
                $itemNumber++;
            }
            
            $orderTotalGoods += number_format( floatval($groupingPrice)*$itemQty, 2 );
            $siTD = ( $itemStockCount ) ? number_format( BIG_STOCK_COST, 2 ) : 0.00;
            $itTD = ( $itemStockCount ) ? number_format( floatval( ($groupingPrice+BIG_STOCK_COST)*$groupingQty ), 2 ) : number_format( floatval($groupingPrice)*$itemQty, 2 );
            
            $authNet->addLineItem($itemID, 'DeKORE', $groupingName, $groupingQty, $groupingPrice, 'N');
            
            $emailMsg .= '<tr>
                              <td>'.$shownItemID.'</td>
                              <td>D&#233;KORE'.$groupingName.'</td>
                              <td>'.$groupingQty.'</td>
                              <td>US $'.number_format( $groupingPrice, 2 ).'</td>
                              <td>US $'.$siTD.'</td>
                              <td>US $'.$itTD.'</td>
                          </tr>';
            
            $ciSerialize = serialize( $groupingArray );
            $cartRes[$cartResKey]['cartItem'] = $ciSerialize;
        }
    }
    
    //DELETE promo from cart
    $sql = "DELETE FROM jsccart WHERE cartHandle = :cartHandle AND itemType = :itemType";
    $qvals = array( ':cartHandle'=>$cartHandle, ':itemType'=>'promo');
    $DB->query( $sql, $qvals, $qopts );
    
    $sql =  ($isB2B) ? "UPDATE b2borders SET orderTotalGoods = :orderTotalGoods, orderTotalGoodsCost = :orderTotalGoodsCost, orderTotalSH = :orderTotalSH, shiptoCompany = :shiptoCompany WHERE orderNumber = :orderNumber" : "UPDATE jscorders SET orderTotalGoods = :orderTotalGoods, orderTotalGoodsCost = :orderTotalGoodsCost, orderTotalSH = :orderTotalSH, shownOrderNum = :shownOrderNum, donation = :donation, bigStockCharge = :bigStockCharge WHERE orderNumber = :orderNumber";
    $qvals = ($isB2B) ? array( ':orderNumber'=>$orderNumber, ':orderTotalGoods'=>$orderTotalGoods, ':orderTotalGoodsCost'=>$orderTotalGoodsCost, ':orderTotalSH'=>$orderTotalSH, ':shiptoCompany'=>'JSC: '.$shownOrderNum) : array( ':orderNumber'=>$orderNumber, ':orderTotalGoods'=>$orderTotalGoods, ':orderTotalGoodsCost'=>$orderTotalGoodsCost, ':orderTotalSH'=>$orderTotalSH, ':shownOrderNum'=>$shownOrderNum, ':donation'=>$donation, ':bigStockCharge'=>$bigStockCharge );
    $DB->query( $sql, $qvals, $qopts );
    
    if($orderStockCount){
        $authNet->addLineItem('SI', 'Stock Image Price', 'Big Stock Image Rights', $orderStockCount, BIG_STOCK_COST, 'N');
    }
    $authNet->addLineItem('S/H', 'Shipping/Handling', $shipMethod, '1', $shipHandling, 'N');
    

    /* SET UP auth.net TRANSACTION */
    $authNet->invoice_num = $orderNumber;
    $authNet->description = "Just Say Cheese Order";

    //Authnet Payment
    $cardChargeAmt = ( $orderTotalGoods + floatval($orderTotalSH) ) - floatval($discount);
    $cardChargeAmt = ( $cardChargeAmt < 0 ) ? 0 : $cardChargeAmt;
    if ($cardChargeAmt != $totalCalcedOnIndex) {
        //failedTrans( $DB, $orderNumber );
        error_log('Submit Order: -ve or zero value on paid page');
        error_log('OTG : '.$orderTotalGoods);
        error_log('DISC : '.$discount);
        error_log('SHIP : '.$orderTotalSH );
        error_log(print_r($cartRes, true));
    }
    if ($cardChargeAmt < $totalCalcedOnIndex) {
        error_log('Submit Order: cardChargeAmt: '.$cardChargeAmt.' indexTotal: '.$totalCalcedOnIndex );
        $cardChargeAmt = $totalCalcedOnIndex;
    }
    $paidCheckout = true;//TODO put this where it should be
    if ( $cardChargeAmt == 0 || $isB2B ) {
        $paidCheckout = false;
        
    }

    $paymentInfo = (object)array();
    $paymentInfo->amount = $cardChargeAmt;
    $paymentInfo->card_num = $paymentData[ 'cardNumber' ]; // test "6011000000000012";
    $paymentInfo->exp_date = $expDate;
    $paymentInfo->card_code =  $paymentData[ 'securityCode' ]; 


    //Finish Authnet object needed fields
    if ($paidCheckout) {
        $customer = (object)array();
        $customer->first_name = $billingAddrData[ 'billingFirstName' ];
        $customer->last_name = $billingAddrData[ 'billingLastName' ];
        $customer->address = $billingAddrData[ 'billingAddress1' ]." ".$billingAddrData[ 'billingAddress2' ];
        $customer->city = $billingAddrData[ 'billingCity' ];
        $customer->state = $billingAddrData[ 'billingState' ];
        $customer->zip = $billingAddrData[ 'billingZipcode' ];
        $customer->country = "US";
        $customer->phone = $billingAddrData[ 'billingPhone' ];
        $customer->email = $billingAddrData[ 'billingEmail' ];
        $customer->cust_id = $clientID;
        $customer->ship_to_first_name = $shippingAddrData[ 'shiptoFirstName' ];
        $customer->ship_to_last_name = $shippingAddrData[ 'shiptoLastName' ];
        $customer->ship_to_address = $shippingAddrData[ 'shiptoAddress1' ]." ".$shippingAddrData[ 'shiptoAddress2' ];
        $customer->ship_to_city = $shippingAddrData[ 'shiptoCity' ];
        $customer->ship_to_state = $shippingAddrData[ 'shiptoState' ];
        $customer->ship_to_zip = $shippingAddrData[ 'shiptoZipcode' ];
        $customer->ship_to_country = "US";

        $authNet->setFields($paymentInfo);
        $authNet->setFields($customer);

        $authRes = $authNet->authorizeAndCapture();
    }
    
    /* SEND AND CHECK TRANSACTION */
    if (!$paidCheckout || ($paidCheckout && $authRes->approved)) {
        $auth_code = $paidCheckout ? $authRes->transaction_id : 'freecheckout';
        if( !$isB2B ){
            $sql = "UPDATE jscorders SET paymentCleared = :paymentCleared, paymentID = :paymentID WHERE orderNumber = :orderNumber";
            $qvals = array( ':orderNumber'=>$orderNumber, ':paymentCleared'=>'1', ':paymentID'=>$auth_code );
            $DB->query( $sql, $qvals, $qopts );
        }
        
        foreach( $cartRes as $itemInfo ){
            
            if( $itemInfo[ 'itemType' ] === 'product' ){
                
                $cartItem = (array) json_decode( $itemInfo[ 'cartItem' ] );
                handleImgSrc( $cartItem, 1 );
                createOrderPDF( $cartItem );
                
            }elseif( $itemInfo[ 'itemType' ] === 'grouping' || $itemInfo[ 'itemType' ] === 'split' ){
                
                $groupingArray = unserialize( $itemInfo[ 'cartItem' ] );
                $bsapiCharge = 1;
                foreach( $groupingArray as $groupingItem ){
                    $cartItem = (array) $groupingItem->item;
                    handleImgSrc( $cartItem, $bsapiCharge );
                    createOrderPDF( $cartItem );
                    $bsapiCharge = ( $itemInfo[ 'itemType' ] === 'split' ) ? 0 : 1;
                }
                
            }
            
            $recordID = $itemInfo[ 'recordID' ];
            $sql = "DELETE FROM jsccart WHERE recordID = :recordID";
            $qvals = array( ':recordID'=>$recordID );
            $DB->query( $sql, $qvals, $qopts );
        }
        
        foreach( $xmlElems as $itemID=>$xml ){
            $xml->asXML( $ordersDir.$itemID.'.xml' );
        }
        
        $_SESSION[ 'successfulOrder' ] = $orderNumber;
        echo 'paymentCleared';
        
        $emailMsg .= '<tr>
                              <td>S/H</td>
                              <td>Shipping/Handling - UPS Ground</td>
                              <td>1</td>
                              <td>US $'.number_format($orderTotalSH, 2).'</td>
                              <td>US $0.00</td>
                              <td>US $'.number_format($orderTotalSH, 2).'</td>
                          </tr>
                          <tr>
                            <td>DISC</td>
                            <td>Total Discounts</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td>US $'.number_format( $discount, 2).'</td>

                          </tr>
                          <tr><td></td><td>Total charged to card:</td><td></td><td></td><td></td><td style="border-top:1px solid black">US $'.money_format('%i', $cardChargeAmt).'</td></tr>
                      </table>
                  </td>
              </tr>
              <tr><td style="padding:20px;"></td></tr>
              <tr style="background-color: #ababab; color: white;"><td style="padding: 5px 10px 5px 10px;">Visa</td></tr>
              <tr>
                  <td style="padding: 5px 10px 5px 10px;">
                      <table border="0" cellpadding="0" cellspacing="0" width="100%">
                          <tr><td width="200">Date/Time:</td><td>'.$now.'</td></tr>
                          <tr><td width="200">Transaction ID:</td><td>'.$auth_code.'</td></tr>
                      </table>
                  </td>
              </tr>
          </table>'.
            '<p>Our concept revolves around the affordability of keeping your wall art fresh. Do not let life get ahead of your d&#233;KORE&#8482; - Get those pictures off your phone and post them to your walls!</p>'.
            '<p><a href="https://justsaycheese.com?pg=order" target="_blank"><img src="cid:jscOrderMore" /></a></p>';
        $mail->isHTML( true );
        $mail->Subject = 'Just Say Cheese Order Confirmation Email';
        $mail->Body = $emailMsg;
        if( SEND_EMAILS === 'YES' ){
            if( !$mail->send() ){
                error_log( 'Submit Order Mailer Error: ' . $mail->ErrorInfo );
            }
        }
    }else{
        echo $authRes->response_reason_text;
        failedTrans( $DB, $orderNumber );
        
        error_log( 'submitOrder.php - credit card error: '.$authRes->response_reason_text );
        error_log( 'cartHandle: '.$cartHandle );
        error_log( 'promo: '.$promo );
        //error_log(print_r($authRes,true));
    }
    /* end */
?>