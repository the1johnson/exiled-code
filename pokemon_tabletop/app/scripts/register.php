<?php
require('config.php');
require('dbHandle.php');

$register_data = file_get_contents('php://input');
$obj_data = json_decode($register_data, true);
$registration_username = $obj_data['data']['username'];
$registration_email = $obj_data['data']['email'];
$registration_password = password_hash($obj_data['data']['password'], PASSWORD_DEFAULT);

$db = new DbHandle(HOST, DB_USERNAME, DB_PASSWORD, DATABASE);
$result = $db->query("INSERT INTO users (username, password, email) VALUES ('$registration_username', '$registration_password', '$registration_email')");

echo json_encode($result);
?>