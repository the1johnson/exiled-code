<?php
require('config.php');
require('dbHandle.php');

$register_data_c = file_get_contents('php://input');
$obj_data_c = json_decode($register_data_c, true);
$registration_username_c = $obj_data_c['data']['username'];

$db_c = new DbHandle(HOST, DB_USERNAME, DB_PASSWORD, DATABASE);
$result_c = $db_c->query("SELECT * FROM users WHERE username='$registration_username_c'");

echo $result_c->num_rows;
?>