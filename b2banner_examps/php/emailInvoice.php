<?php
    require_once( '../utils/config.php' );
    require_once( '../utils/DBConnect.class.php' );
    require_once( '../phpMailer/PHPMailerAutoload.php' );

    $DB = new DbConnect();
    $postData = file_get_contents("php://input");
    $emailData = json_decode($postData, true);
    
    $sql = 'SELECT orderNumber, orderReference, whoPlaced, orderTotalSH FROM b2borders WHERE orderNumber = :orderNumber';
    $qvals = array( ':orderNumber'=>$emailData['orderNumber'] );
    $qopts = array();
    $orderInfoRes = $DB->query( $sql, $qvals, $qopts );
    $orderInfo = $orderInfoRes[0];
    $oRef = ( $orderInfo['orderReference'] === '' ) ? 'N/A' : $orderInfo['orderReference'];
    $oPlaced = ( $orderInfo['whoPlaced'] === '' ) ? 'N/A' : $orderInfo['whoPlaced'];
    $oShippingCharge = floatval( $orderInfo['orderTotalSH'] );
    error_log(print_r($orderInfo,true));
    
    $sql = 'SELECT itemID, reference, itemQty, width, height, materialType, matCost, finCost, hwCost FROM b2bitems WHERE orderNumber = :orderNumber';
    $orderItems = $DB->query( $sql, $qvals, $qopts );
    
    $fontFix = "'Helvetica Neue'";
    $emailBody = '<table border="0" cellspacing="0" cellpadding="0" style="width:100%;" bgcolor="#F8F8F8">
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
                                        <td style="text-align:center; font-weight:bold;font-size:20px;">Order Invoice</td>
                                    </tr>
                                    <tr>
                                        <td style="padding-top:20px;padding-left:20px;padding-right:20px;">
                                            <table border="0" cellspacing="0" cellpadding="0" width="600">
                                                <thead>
                                                    <tr>
                                                        <th style="padding-bottom:10px;">Order #</th>
                                                        <th style="padding-bottom:10px;">Reference</th>
                                                        <th style="padding-bottom:10px;">Placed By</th>
                                                    </tr>
                                                    <tr style="text-align:center;">
                                                        <td>'.$emailData['orderNumber'].'</td>
                                                        <td>'.$oRef.'</td>
                                                        <td>'.$oPlaced.'</td>
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
                                                $orderSubtotal = $oShippingCharge;
                                                foreach( $orderItems as $oKey=>$orderInfo ){
                                                    $itemSubtotal = floatval( $orderInfo['matCost'] ) + floatval( $orderInfo['finCost'] ) + floatval( $orderInfo['hwCost'] );
                                                    $orderSubtotal += $itemSubtotal;
                                                    $emailBody .= '<tr>
                                                            <td>'.$orderInfo['itemID'].'</td>
                                                            <td>'.$orderInfo['reference'].'</td>
                                                            <td>'.$orderInfo['itemQty'].'</td>
                                                            <td>'.$orderInfo['height'].'</td>
                                                            <td>'.$orderInfo['width'].'</td>
                                                            <td>'.$orderInfo['materialType'].'</td>
                                                            <td>$'.number_format( $itemSubtotal, 2, '.', '' ).'</td>
                                                        </tr>';
                                                }
                                                
                                                $emailBody .= '<tr>
                                                        <td colspan="6" style="text-align:right;padding-right: 20px;padding-top:20px;">
                                                            <strong>Shipping/Handling:</strong>
                                                        </td>
                                                        <td style="padding-top:20px;">$'.number_format( $oShippingCharge, 2, '.', '' ).'</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="6" style="text-align:right;padding-right: 20px;padding-top:20px;">
                                                            <strong>Subtotal:</strong>
                                                        </td>
                                                        <td style="padding-top:20px;">$'.number_format( $orderSubtotal, 2, '.', '' ).'</td>
                                                    </tr>
                                                    <tr>
                                                        <td colspan="7" style="text-align:center;padding-top:10px;">
                                                            <a href="'.HTTP_SERVER.'admin-accounting-detail/'.$emailData['orderNumber'].'" target="_blank"><img src="cid:viewInvoice" alt="View Invoice Button" /></a>
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
    
    if( SEND_EMAILS === 'YES' ){
        $mailerOpts = array( 'host'=>'e31230v2-1089.icertified.net', 'username'=>'donotreply@b2banner.com', 'password'=>'myaap123', 'from'=>'donotreply@b2banner.com', 'fromName'=>'B2Banner - Do Not Reply' );
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
        
        $emailList = explode(';', $emailData['emailList']);
        foreach( $emailList as $emailAddr ){
            $mail->addBCC($emailAddr);
        }
    
        $mail->isHTML( true );
        $mail->Subject ='B2banner Order #'.$emailData['orderNumber'].' Invoice';
        $mail->AddEmbeddedImage('../../../images/logos/default/logo.png', 'b2bLogo');
        $mail->AddEmbeddedImage('../../../images/email/viewInvoice.png', 'viewInvoice');
        $mail->AddEmbeddedImage('../../../images/poweredbyMYAAP.png', 'myaapPowered');
        $mail->Body = $emailBody;
        if( !$mail->send() ){
            error_log( 'emailInvoice.php Order Invoice Mailer Error: ' . $mail->ErrorInfo );
        }
    }
?>