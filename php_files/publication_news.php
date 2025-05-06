<?php
    $newsData = [];
    $searchStr = strtolower($_GET["search"]);
    $theme = $_GET["theme"];

    if (($handle = fopen("../csv_files/news.csv", "r")) !== false) {
        while (($data = fgetcsv($handle, 1000, ",")) !== false) {
            if ((strcasecmp($data[4], $theme) == 0) || (strcasecmp($theme, "Toutes") == 0)){
                if ((strcasecmp($searchStr, "") == 0) || (strpos(strtolower($data[1]), $searchStr) !== false) || (strpos(strtolower($data[2]), $searchStr) !== false)){
                    $newsData[] = [
                        'id' => $data[0],
                        'image' => $data[3],
                        'title' => $data[1], 
                        'content' => $data[2],
                        'date' => $data[6],
                    ];
                }
            }
        }
        fclose($handle);
    }


    header('Content-Type: application/json');
    echo json_encode($newsData);

?>