<?php
    session_start();
    require_once( '../utils/config.php' );
    require_once( '../utils/DBConnect.class.php' );
    require_once( '../phpMailer/PHPMailerAutoload.php' );
    
    /* GET CART ITEM POST DATA */
    $postData = file_get_contents("php://input");
    $cartObject = json_decode($postData, true);
    $cartItems = $cartObject['cartItems'];
    $cartShippingInfo = $cartObject['info'];
    $DB = new DbConnect();
    $clientID = isset($_SESSION[ 'loggedInClientID' ]) ? $_SESSION[ 'loggedInClientID' ] : 'default';
    $whoPlaced = isset($_SESSION[ 'username']) ? $_SESSION[ 'username'] : 'default';
    
    /* CREATE NEW ORDER WITH BASE INFO */
    $sql = 'INSERT INTO b2borders (orderStatus, orderComments, orderReference, clientID, whoPlaced, contactName, contactEmail, shipMethod, shiptoCompany, shiptoAttention, shiptoAddress1, shiptoAddress2, shiptoCity, shiptoState, shiptoZipcode) VALUES(:orderStatus, :orderComments, :orderReference, :clientID, :whoPlaced, :contactName, :contactEmail, :shipMethod, :shiptoCompany, :shiptoAttention, :shiptoAddress1, :shiptoAddress2, :shiptoCity, :shiptoState, :shiptoZipcode)';
    $qvals = array( ':orderStatus'=>'pending', ':orderComments'=>$cartShippingInfo['notes'], ':orderReference'=>$cartShippingInfo['reference'], ':clientID'=>$clientID, ':whoPlaced'=>$whoPlaced, ':contactName'=>$cartShippingInfo['contactName'], ':contactEmail'=>$cartShippingInfo['contactEmail'], ':shipMethod'=>$cartShippingInfo['shipMethod'], ':shiptoCompany'=>$cartShippingInfo['company'], ':shiptoAttention'=>$cartShippingInfo['attention'], ':shiptoAddress1'=>$cartShippingInfo['addressOne'], ':shiptoAddress2'=>$cartShippingInfo['addressTwo'], ':shiptoCity'=>$cartShippingInfo['city'], ':shiptoState'=>$cartShippingInfo['state'], ':shiptoZipcode'=>$cartShippingInfo['zipcode'] );
    $qopts = array();
    $orderNumber = $DB->query( $sql, $qvals, $qopts );
    
    /* SAVE CLIENT ADDRESS IF MARKED */
    if( $cartShippingInfo['saveClientInfo'] ){
        $sql = 'INSERT INTO b2bclientsavedaddresses (clientID, shiptoCompany, shiptoAttention, shiptoAddress1, shiptoAddress2, shiptoCity, shiptoState, shiptoZipcode) VALUE (:clientID, :shiptoCompany, :shiptoAttention, :shiptoAddress1, :shiptoAddress2, :shiptoCity, :shiptoState, :shiptoZipcode)';
        $qvals = array(':clientID'=>$clientID, ':shiptoCompany'=>$cartShippingInfo['company'], ':shiptoAttention'=>$cartShippingInfo['attention'], ':shiptoAddress1'=>$cartShippingInfo['addressOne'], ':shiptoAddress2'=>$cartShippingInfo['addressTwo'], ':shiptoCity'=>$cartShippingInfo['city'], ':shiptoState'=>$cartShippingInfo['state'], ':shiptoZipcode'=>$cartShippingInfo['zipcode']);
        $DB->query( $sql, $qvals, $qopts );
    }
    
    /* INTI ORDER INFO EMAIL CONTENT */
    $mailerOpts = array( 'host'=>'e31230v2-1089.icertified.net', 'username'=>'donotreply@b2banner.com', 'password'=>'myaap123', 'from'=>'donotreply@b2banner.com', 'fromName'=>'B2Banner - Do Not Reply' );
    $emailRef = ( $cartShippingInfo['reference'] === '' ) ? 'N/A' : $cartShippingInfo['reference'];
    $fontFix = "'Helvetica Neue'";
    $orderInfoEmail = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;" bgcolor="#F8F8F8">
            <tbody>
                <tr>
                    <td style="padding-top:50px;">
                        <center style="font-family: '.$fontFix.',Helvetica,Arial,sans-serif;">
                            <table border="0" cellspacing="0" cellpadding="0" width="600" bgcolor="#FFFFFF" style="border:1px solid #e7e7e7;">
                                <tbody>
                                    <tr>
                                        <td style="text-align:center;padding-top:20px;padding-bottom:20px;"><img src="cid:b2bLogo" alt="B2Banner Logo" /></td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:center; font-weight:bold;font-size:20px;">New Order Created</td>
                                    </tr>
                                    <tr>
                                        <td style="text-align:justify;padding-left:20px;padding-right:20px;padding-bottom:20px;">
                                            <p>This is a courtesy email informing you that a new order has been created on your b2banner account. Before this order is sent to the presses it requires approval.</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-left:20px;padding-right:20px;">
                                            <table border="0" cellspacing="0" cellpadding="0" width="600">
                                                <thead>
                                                    <tr>
                                                        <th style="padding-bottom:10px;">Order #</th>
                                                        <th style="padding-bottom:10px;">Reference</th>
                                                        <th style="padding-bottom:10px;">Placed By</th>
                                                    </tr>
                                                    <tr style="text-align:center;">
                                                        <td>'.$orderNumber.'</td>
                                                        <td>'.$emailRef.'</td>
                                                        <td>'.$whoPlaced.'</td>
                                                    </tr>
                                                </thead>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding-left:20px;padding-right:20px;padding-top:20px;padding-bottom:20px;">
                                            <table border="0" cellspacing="0" cellpadding="0" width="600">
                                                <thead>
                                                    <tr style="text-align:left;">
                                                        <th style="padding-bottom:10px;">Item ID</th>
                                                        <th style="padding-bottom:10px;">Reference</th>
                                                        <th style="padding-bottom:10px;">Quantity</th>
                                                        <th style="padding-bottom:10px;">Height</th>
                                                        <th style="padding-bottom:10px;">Width</th>
                                                        <th style="padding-bottom:10px;">Material</th>
                                                        <th style="padding-bottom:10px;">Cost</th>
                                                    </tr>
                                                </thead>
                                                <tbody>';
    
    /* CREATE ORDER ITEMS */
    $orderTotalGoods = 0.00;
    $orderTotalGoodsCost = 0.00;
    $itemCount = 1;
    foreach( $cartItems as $itemInfo ){
        $contourCut = ( strpos($itemInfo['substrate'], 'standee') === false ) ? 'NO' : 'YES' ;
        $hardwareData = 'none';
        $artSides = ( $itemInfo['sideCount'] == 1 || ( $itemInfo['sideCount'] == 2 && $itemInfo['artFileOne'] === $itemInfo['artFileTwo'] ) ) ? 'same' : 'diff';
        $itemStatus = ( $itemInfo['artSource'] === 'upload' ) ? 'pending' : 'noart';
        $itemID = $orderNumber.'_'.$itemCount;
        
        /* FIX UP HARDWARD DATE */
        $hwCost = 0.00;
        $hwKeyTransformer = array( 'hstakes'=>'H-Stakes:', 'easels'=>'Easels:', 'drings'=>'D-Rings:' );
        foreach( $itemInfo['hardware'] as $hwKey=>$hwVal ){
            if( $hwVal['count'] != 0 ){
                $hardwareData = ( $hardwareData === 'none' ) ? $hwKeyTransformer[$hwKey].$hwVal['count'] : $hardwareData.','.$hwKeyTransformer[$hwKey].$hwVal['count'];
            }
            $hwCost += $hwVal['charge'];
        }
        
        /* GET FINISH COST */
        $finCost = 0.00;
        foreach( $itemInfo['finish'] as $finKey=>$finVal ){
            $finCost += isset( $finVal['charge'] ) ? $finVal['charge'] : 0;
        }
        
        /* INCREASE ORDER TOTAL MONIES BY ITEMS MONIES */
        $orderTotalGoods += $itemInfo['subTotal'];
        $orderTotalGoodsCost += $itemInfo['gbcSubTotal'];
        
        /* INSERT ITEMS INTO THE DB */
        $sql = 'INSERT INTO b2bitems (orderNumber, itemNumber, itemID, itemStatus, itemType, reference, itemQty, width, height, printSides, artSides, materialClass, materialType, packing, hemType, hemSides, pocketType, pocketSides, grommetType, grommetSides, webType, webSides, bleedType, bleedSides, hardwareData, contourCut, artFile1, artFile2, shipMethod, sqFootPricing, sqFootCost, gbcCost, matCost, finCost, hwCost, notes) VALUES(:orderNumber, :itemNumber, :itemID, :itemStatus, :itemType, :reference, :itemQty, :width, :height, :printSides, :artSides, :materialClass, :materialType, :packing, :hemType, :hemSides, :pocketType, :pocketSides, :grommetType, :grommetSides, :webType, :webSides, :bleedType, :bleedSides, :hardwareData, :contourCut, :artFile1, :artFile2, :shipMethod, :sqFootPricing, :sqFootCost, :gbcCost, :matCost, :finCost, :hwCost, :notes)';
        $qvals = array( ':orderNumber'=>$orderNumber, ':itemNumber'=>$itemCount, ':itemID'=>$itemID, ':itemStatus'=>$itemStatus, ':itemType'=>$itemInfo['category'], ':reference'=>$itemInfo['reference'], ':itemQty'=>$itemInfo['quantity'], ':width'=>$itemInfo['printWidth'], ':height'=>$itemInfo['printHeight'], ':printSides'=>$itemInfo['sideCount'], ':artSides'=>$artSides, ':materialClass'=>'anywhere', ':materialType'=>$itemInfo['material'], ':packing'=>$itemInfo['packing'], ':hemType'=>$itemInfo['finish']['hem']['size'], ':hemSides'=>$itemInfo['finish']['hem']['sides'], ':pocketType'=>$itemInfo['finish']['polePockets']['size'], ':pocketSides'=>$itemInfo['finish']['polePockets']['sides'], ':grommetType'=>$itemInfo['finish']['grommet']['size'], ':grommetSides'=>$itemInfo['finish']['grommet']['sides'], ':webType'=>$itemInfo['finish']['webbing']['size'], ':webSides'=>$itemInfo['finish']['webbing']['sides'], ':bleedType'=>$itemInfo['finish']['bleed']['size'], ':bleedSides'=>$itemInfo['finish']['bleed']['sides'], ':hardwareData'=>$hardwareData, ':contourCut'=>$contourCut, ':artFile1'=>$itemInfo['artFileOne'], ':artFile2'=>$itemInfo['artFileTwo'], ':shipMethod'=>$cartShippingInfo['shipMethod'], ':sqFootPricing'=>$itemInfo['pricePoint'], ':sqFootCost'=>$itemInfo['gbcPricePoint'], ':gbcCost'=>$itemInfo['gbcCost'], ':matCost'=>$itemInfo['matCost'], ':finCost'=>$finCost, ':hwCost'=>$hwCost, ':notes'=>$itemInfo['itemComments'] );
        $DB->query( $sql, $qvals, $qopts );
        
        /* ADD ITEM TO ORDER INFO EMAIL */
        $emailItmRef = ( $itemInfo['reference'] === '' ) ? 'N/A' : $itemInfo['reference'];
        $orderInfoEmail .= '<tr>
                                                        <td>'.$itemID.'</td>
                                                        <td>'.$emailItmRef.'</td>
                                                        <td>'.$itemInfo['quantity'].'</td>
                                                        <td>'.$itemInfo['printHeight'].'in</td>
                                                        <td>'.$itemInfo['printWidth'].'in</td>
                                                        <td>'.$itemInfo['material'].' '.$itemInfo['category'].'</td>
                                                        <td>$'.number_format( $itemInfo['subTotal'], 2 ).'</td>
                                                    </tr>';
        
        /* SENT ART REQUEST EMAIL */
        if( $itemInfo['artSource'] === 'request' && SEND_EMAILS === 'YES' ){
        //if( $itemInfo['artSource'] === 'request' ){
            
            $emailMsg = "Art work request for order #: $orderNumber <br/>
                    Print Material: ".$itemInfo['material']." <br/>
                    Print Width: ".$itemInfo['printWidth']."<br/>
                    Print Height: ".$itemInfo['printHeight']."<br/>
                    <a href='".HTTP_SERVER."storeFront-uploadRequest/$itemID' target='_blank' >Click Here To Upload</a>";
            
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
            $mail->addAddress( $itemInfo['artRequestEmail'] );
            $mail->isHTML( true );
            $mail->Subject = 'B2banner Artwork Request - Order #'.$orderNumber;
            $mail->Body = $emailMsg;
            if( !$mail->send() ){
                error_log( 'submitOrder.php Art Request Mailer Error: ' . $mail->ErrorInfo );
            }
        }
        
        $itemCount++;
    }
    
    /* UPDATE ORDER */
    $sql = 'UPDATE b2borders SET orderTotalGoods = :orderTotalGoods, orderTotalGoodsCost = :orderTotalGoodsCost WHERE orderNumber = :orderNumber';
    $qvals = array( ':orderTotalGoods'=>$orderTotalGoods, ':orderTotalGoodsCost'=>$orderTotalGoodsCost, ':orderNumber'=>$orderNumber );
    $DB->query( $sql, $qvals, $qopts );
    
    /* DELTE CART ITEMS */
    $loggedUserID = isset( $_SESSION[ 'loggedUserID'] ) ? $_SESSION[ 'loggedUserID'] : 'default';
    $cartHandle = $clientID.'-'.$loggedUserID;
    $sql = 'DELETE FROM b2bcart WHERE cartHandle = :cartHandle';
    $qvals = array( ':cartHandle'=>$cartHandle );
    $DB->query( $sql, $qvals, $qopts );
    
    /* EMAIL ORDER CREATED INFO */
    if( SEND_EMAILS === 'YES' ){
        
        $orderInfoEmail .= '<tr>
                                                        <td colspan="6" style="text-align:right;padding-right: 20px;padding-top:20px;">
                                                            <strong>Subtotal:</strong>
                                                        </td>
                                                        <td style="padding-top:20px;">'.$orderTotalGoods.'</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="7" style="text-align:center;padding-top:10px;">
                                                            <a href="#" target="_blank"><img src="cid:orderDetail" alt="Order Details Button" /></a>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                    </td>
                </tr>
                <tr>
                    <td>
                        <center>
                            <table border="0" cellspacing="0" cellpadding="0" width="600">
                                <tbody>
                                    <tr style="background-color:#F8F8F8;">
                                        <td style="padding-top:20px;padding-bottom:50px;"><img style="float:right;" src="cid:myaapPowered" alt="Powered By MYAAP" /></td>
                                    </tr>
                                </tbody>
                            </table>
                        </center>
                    </td>
                </tr>
            </tbody>
        </table>';
        
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
        $mail->addAddress( 'donotreply@b2banner.com' );
        
        $sql = 'SELECT email FROM b2bclientpersons WHERE clientID = :clientID AND accesslevel = :accesslevel';
        $qvals = array( ':clientID'=>$clientID, ':accesslevel'=>'admin' );
        $clientAdminList = $DB->query( $sql, $qvals, $qopts );
        $mail->addBCC($cartShippingInfo['contactEmail']);
        foreach( $clientAdminList as $clientAdmin ){
            $mail->addBCC($clientAdmin['email']);
        }
        
        $mail->isHTML( true );
        $mail->Subject = "B2banner Order #$orderNumber Created";
        $mail->AddEmbeddedImage('../../../images/logos/default/logo.png', 'b2bLogo');
        $mail->AddEmbeddedImage('../../../images/poweredbyMYAAP.png', 'myaapPowered');
        $mail->AddEmbeddedImage('../../../images/email/orderDetails.png', 'orderDetail');
        $mail->Body = $orderInfoEmail;
        if( !$mail->send() ){
            error_log( 'submitOrder.php Order Info Mailer Error: ' . $mail->ErrorInfo );
        }
    }
?>