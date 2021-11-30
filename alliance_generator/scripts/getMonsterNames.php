<?php
    require 'config.php';
    require 'DbConnect.class.php';
    
    $DB = new DbConnect();
    $qVals = array();
    $qOpts = array();
    $sql = 'SELECT name, creature_type FROM Monsters';
    
    $results = $DB->query( $sql, $qVals, $qOpts );
    
    echo json_encode($results);
?>