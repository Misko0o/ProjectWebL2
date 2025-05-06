<?php
    function createRecordCSV($data){
        $open = fopen("../csv_files/comments.csv", "a");
        fputcsv($open, $data["vals"]);
        fclose($open);
        return TRUE;
    }

    $response = array();

    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);
        $data['vals'][] = date('d/m/Y');

        $res = createRecordCSV($data);
        if ($res == TRUE){
            $response["result"] = $data;
        }
        else{
            $response["result"] = $data;
        }
    }

    
    header('Content-Type: application/json');
    echo json_encode($response);
?>