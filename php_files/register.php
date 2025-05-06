<?php
    function createRecordCSV($data){
        $open = fopen("../csv_files/users.csv", "a");
        fputcsv($open, $data["vals"]);
        fclose($open);
        return TRUE;
    }

    function emailExists($email){
        $open = fopen("../csv_files/users.csv", "r");
        if (!$open){
            return FALSE;
        }
        fgetcsv($open, 1000, ",");
        
        while (($data = fgetcsv($open, 1000, ",")) !== FALSE) 
        {
            if ($data[2] == $email){
                fclose($open);
                return TRUE;
            }
        }
        fclose($open);
        return FALSE;
    }

    session_start();
    $response = array();

    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        $response["em"] = $data["vals"][2];
        if(emailExists($data["vals"][2])){
            http_response_code(400);
            $response["error"] = "Email already exists!";
        }
        else{
            createRecordCSV($data);
        }
        
    }

    
    header('Content-Type: application/json');
    echo json_encode($response);
?>