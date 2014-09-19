<?php
session_start();
if(isset($_SESSION['logged'])){
    
    echo $_SESSION['logged'];
    
}else{
    
    echo false;
    
}
?>