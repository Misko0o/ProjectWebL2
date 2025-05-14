<?php
header('Content-Type: application/json; charset=utf-8');

$newsData  = [];
$searchStr = strtolower($_GET['search'] ?? '');
$theme     = $_GET['theme'] ?? 'Toutes';

if (($handle = fopen(__DIR__ . '/../csv_files/news.csv', 'r')) !== false) {
    fgetcsv($handle, 1000, ';');

    while (($data = fgetcsv($handle, 1000, ';')) !== false) {
        $rowTheme = $data[5];

        if (strcasecmp($rowTheme, $theme) !== 0 
            && strcasecmp($theme, 'Toutes') !== 0) {
            continue;
        }

        $title   = strtolower($data[1]);
        $content = strtolower($data[2]);
        if ($searchStr !== ''
            && strpos($title, $searchStr) === false
            && strpos($content, $searchStr) === false) {
            continue;
        }

        $newsData[] = [
            'id'      => $data[0],
            'image'   => $data[3],
            'title'   => $data[1],
            'content' => $data[2],
            'date'    => $data[4],
            'theme'   => $data[5],
            'author'  => $data[6],
        ];
    }

    fclose($handle);
}

echo json_encode($newsData);
exit;
