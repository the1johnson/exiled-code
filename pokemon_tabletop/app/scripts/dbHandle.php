<?php
final class DbHandle
{
    private $host, $db_usernamne, $db_password, $database, $link;
    
    public function __construct($_host, $_username, $_password, $_database){
        $this->host = $_host;
        $this->db_username = $_username;
        $this->db_password = $_password;
        $this->database = $_database;
        
        $this->link = new mysqli($this->host, $this->db_username, $this->db_password, $this->database) OR die('Could not connect');
        
        return true;
    }
    public function query($_query){
        $result = $this->link->query($_query);
        
        if(!$result){die('invalid query '.$this->link->error);}
        return $result;
    }
    public function lastId(){
        return $this->link->insert_id;
    }
    public function __destruct(){
        mysqli_close($this->link);
    }
}
?>