<?php
require('config.php');
require('dbHandle.php');

$login_data = file_get_contents('php://input');
$obj_data = json_decode($login_data, true);
$login_username = $obj_data['data']['username'];
$login_password = $obj_data['data']['password'];
$valid_login = false;

$db_c = new DbHandle(HOST, DB_USERNAME, DB_PASSWORD, DATABASE);
$result = $db_c->query('SELECT * FROM users WHERE username="'.$login_username.'"');

$row = $result->fetch_assoc();
$pass_hash = $row['password'];

if(password_verify($login_password, $pass_hash)){
    $valid_login = true;
    session_start();
    $_SESSION['user_id'] = $row['user_id'];
    $_SESSION['username'] = $row['username'];
    $_SESSION['logged'] = true;
}
echo $valid_login;
?>