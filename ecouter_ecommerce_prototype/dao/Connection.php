<?php require_once("connect_constants.php");

class Connection {
	
	public function __construct() {
		//echo "Connection Class Constructed <br />";
	}
	
	public function getConnected() {
		
		@ $connection = new mysqli(DB_SERVER, DB_USER, DB_PASS, DB_NAME);
		if (!$connection){
			$connection = null;
			//echo "Database connection failed: ".mysql_error();
		}else{
			//echo "Database connection success!!!<br />";
		}

		return $connection;
	}
	function closeConnection($pConnect) {
		$pConnect -> close();
		//echo "Connection closed. <br />";
	} 
	
}
/* DEPRICATED
	public function selectDatabase($pConnection) {
		$dbSelected = mysql_select_db(DB_NAME, $pConnection);
		
		if (!$dbSelected) {
			die("Database selection failed: " . mysql_error());
		} else {
			echo "Database selection SUCCEEDED!!! <br />";	
		}
	}*/
?>