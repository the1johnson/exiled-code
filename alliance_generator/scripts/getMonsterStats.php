<?php
    require 'config.php';
    require 'DbConnect.class.php';
    
    $DB = new DbConnect();
    $monsterID = isset($_POST['id']) ? $_POST['id'] : 0;
    $qVals = array( ':id'=>$monsterID );
    $qOpts = array();
    $sql = 'SELECT * FROM Monsters WHERE id = :id';
    
    $results = $DB->query( $sql, $qVals, $qOpts );
    
    echo json_encode($results);
?>