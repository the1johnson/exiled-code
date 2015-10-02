<?php
    class DbConnect{
        
        private $dbHost = DB_HOST;
        private $dbUser = DB_USER;
        private $dbPass = DB_PASS;
        private $dbName = DB_NAME;
        private $dbType = DB_TYPE;
        
        private $dbHandle;
        private $sth;
        private $qRes;
        private $error;
        
        public function __construct(){
            $dsn = $this->dbType.':host='.$this->dbHost.';dbname='.$this->dbName;
            $options = array(
                PDO::ATTR_PERSISTENT => true, 
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
            );
            try{
                $this->dbHandle = new PDO($dsn, $this->dbUser, $this->dbPass, $options);
            }catch( PDOException $e ){
                $this->error = $e->getMessage();
                error_log( 'PDO Conenction Error:'.$this->error );
            }
        }
        
        public function query($stmt, $values, $opts){
            $fetchMode = isset( $opts['fetchMode'] ) ? $opts['fetchMode'] : PDO::FETCH_ASSOC;
            $this->sth = $this->dbHandle->prepare( $stmt );
            $this->sth->execute( $values );
            
            $stmtExplode = explode( ' ', $stmt );
            $queryType = $stmtExplode[0];
            
            if( $queryType === 'SELECT' || $queryType === 'SHOW' ){
                $this->qRes = $this->sth->fetchAll( $fetchMode );
            }else if( $queryType === 'INSERT' ){
                $this->qRes = $this->dbHandle->lastInsertId();
            }else{
                $this->qRes = 'Query Ran: '.$stmt;
            }
            
            return $this->qRes;
        }
    }
?>