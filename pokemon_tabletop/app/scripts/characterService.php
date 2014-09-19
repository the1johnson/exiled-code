<?php
require('config.php');
require('dbHandle.php');

session_start();
$db_c = new DbHandle(HOST, DB_USERNAME, DB_PASSWORD, DATABASE);

$char_data = file_get_contents('php://input');
$obj_data = json_decode($char_data, true);
if($obj_data['data']['call_status'] === 'new_sheet'){
    $db_c->query('INSERT INTO '.$obj_data['data']['sheet_table'].' (user_id) VALUES ("'.$_SESSION['user_id'].'")');
    $new_char_id = $db_c->lastId();
    
    $db_c->query('INSERT INTO poke_sheet (char_id) VALUES ("'.$new_char_id.'")');
    $new_poke_id = $db_c->lastId();
    
    for($i=0, $k=9; $i<$k; $i++){
        $db_c->query('INSERT INTO poke_move (poke_id) VALUES ("'.$new_poke_id.'")');
    }
    
    echo $new_char_id;
}elseif($obj_data['data']['call_status'] === 'sheet_state'){
    $sheet_state = false;
     
     if(isset($_SESSION['user_id']) && isset($_SESSION['username'])){
        $result = $db_c->query('SELECT * FROM character_sheet WHERE char_id = "'.$obj_data['data']['char_id'].'" AND user_id = "'.$_SESSION['user_id'].'"');
        
        if($result->num_rows > 0){
            $sheet_state = true;
        }
     }
     
    echo $sheet_state;
}elseif($obj_data['data']['call_status'] === 'read_char_sheet'){
    $result = $db_c->query('SELECT * FROM character_sheet WHERE char_id = "'.$obj_data['data']['char_id'].'"');
    
    echo json_encode($result->fetch_assoc());
}elseif($obj_data['data']['call_status'] === 'read_poke_sheet'){
    $result = $db_c->query('SELECT * FROM poke_sheet WHERE char_id = "'.$obj_data['data']['char_id'].'"');
    if($result->num_rows > 0){
        $poke_data = [];
        
        while($row = $result->fetch_assoc()){
            array_push($poke_data, $row);
        }
        echo json_encode($poke_data);
    }else{
        echo false;
    }
}elseif($obj_data['data']['call_status'] === 'add_pokemon'){
    
}elseif($obj_data['data']['call_status'] === 'character_sheet_check'){
    $result = $db_c->query('SELECT char_id, charName, charClass1, charClass2, charClass3, charClass4 FROM character_sheet WHERE user_id = "'.$_SESSION['user_id'].'"');
    if($result->num_rows > 0){
        $char_sheet_holder = [];
        while($row = $result->fetch_assoc()){
            array_push($char_sheet_holder, array('char_id'=>$row['char_id'], 'charName'=>$row['charName'], 'charClass1'=>$row['charClass1'], 'charClass2'=>$row['charClass2'], 'charClass3'=>$row['charClass3'], 'charClass4'=>$row['charClass4']));
        }
        echo json_encode($char_sheet_holder);
    }else{
        echo false;
    }
}
?>