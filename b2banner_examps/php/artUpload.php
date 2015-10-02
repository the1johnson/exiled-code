<?php
    require_once( '../utils/config.php' );
    require_once( '../globals.php' );
    session_start();
    
    $clientID = isset($_SESSION[ 'loggedInClientID' ]) ? $_SESSION[ 'loggedInClientID' ] : 'default';
    
    /* GET THE FILE TYPE FROM THE UPLOADED FILE */
    $fileName = $_FILES['file']['name'];
    $fileType = pathinfo( $fileName, PATHINFO_EXTENSION );
    $fileType = ( $fileType === 'ai' ) ? 'pdf' : $fileType;
    
    /* CREATE A RANDOM NAME FOR THE FILE */
    $randomString = generateRandomString(5, 7);
    $now = date('Y-m-d');
    $newFileName = $now.'_'.$randomString.'.'.$fileType;
    $previewFileName = $now.'_'.$randomString.'.jpg';
    
    /* CHECK IF CLIENT HAS UPLOAD AND PREIVEW DIRECTORIES IF THEY DO NOT THEN MAKE THEM AND UPLOAD THE FILE TO UPLOADS */
    $uploadsFolderLoc = "../../../images/uploads/$clientID/";
    $previewsFolderLoc = "../../../images/previews/$clientID/";
    if( !file_exists($uploadsFolderLoc) ){
        mkdir($uploadsFolderLoc);
    }
    if( !file_exists($previewsFolderLoc) ){
        mkdir($previewsFolderLoc);
    }
    $destination = $uploadsFolderLoc.$newFileName;
    move_uploaded_file( $_FILES['file']['tmp_name'], $destination );
    
    /* CREATE A DISPLAY PREIVEW OF THE FILE */
    $fileParams = get_input_params($destination);
    $editSize = ( $fileParams[ 'height' ] > $fileParams[ 'width' ] ) ? 'x700': '700x';
    $editRes = 150;
    $cmd = ( $fileType === 'psd' ) ? IMAGEMAGICK_CONVERT.$uploadsFolderLoc.$newFileName.' -resize '.$editSize.' -density '.$editRes.'x'.$editRes.' -flatten -quality 100 '.$previewsFolderLoc.$previewFileName : IMAGEMAGICK_CONVERT.$uploadsFolderLoc.$newFileName.' -resize '.$editSize.' -density '.$editRes.'x'.$editRes.' -quality 100 '.$previewsFolderLoc.$previewFileName;
    exec( $cmd );
    
    echo json_encode( array('print'=>$newFileName, 'preview'=>$previewFileName) );
?>