<?php

    function get($login){
        $open = fopen("../csv_files/users.csv", "r");
        if (!$open){
            return NULL;
        }
        fgetcsv($open, 1000, ",");
        
        while (($data = fgetcsv($open, 1000, ",")) !== FALSE) 
        {
            if ($data[2] == $login){
                fclose($open);
                return $data[3];
            }
        }
        fclose($open);
        return NULL;
    }

    function exist($login){
        $open = fopen("../csv_files/users.csv", "r");
        if (!$open){
            return FALSE;
        }
        fgetcsv($open, 1000, ",");
        
        while (($data = fgetcsv($open, 1000, ",")) !== FALSE) 
        {
            if ($data[2] == $login){
                fclose($open);
                return TRUE;
            }
        }
        fclose($open);
        return FALSE;
    }

    function loginOK($login, $mdp){
        $ifExists = exist($login);
        if (!$ifExists){
            return FALSE;
        }
        $mdpDB = get($login);

        if ($mdp == $mdpDB){
            return TRUE;
        }
        return FALSE;
    }

    session_start();
    $response = array();

    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        $response["credentialsOk"] = 0;
        $exists = loginOK($data["email"], $data["password"]);
        if($exists === TRUE){
            $response["credentialsOk"] = 1;
        }
    }

    
    header('Content-Type: application/json');
    echo json_encode($response);
?>