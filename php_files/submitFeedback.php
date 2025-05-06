<?php

    function createRecordCSV($data){
        $open = fopen("../csv_files/news.csv", "a");
        fputcsv($open, $data["vals"]);
        fclose($open);
        return TRUE;
    }

    session_start();
    $response = array();

    $last_id = 0;
    if (($handle = fopen("../csv_files/news.csv", "r")) !== false) {
        while (($data = fgetcsv($handle, 1000, ",")) !== false) {
            $last_id = (int) $data[0];
        }
        fclose($handle);
    }
    $last_id += 1;

    if($_SERVER["REQUEST_METHOD"] === "POST"){
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);
        $data['vals'][] = date('d/m/Y');
        array_unshift($data['vals'], $last_id);
        
        createRecordCSV($data);
        $response = [
            "message" => "Thank you! Your post was successfully added!"
        ];
    }

    header('Content-Type: application/json');
    echo json_encode($response);
?>

