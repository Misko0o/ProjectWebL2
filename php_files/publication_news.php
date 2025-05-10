<?php
header('Content-Type: application/json; charset=utf-8');

// 1) Считываем лайки из CSV в массив $likesMap[id] = count
$likesMap = [];
$likesCsv = __DIR__ . '/../csv_files/likes.csv';
if (file_exists($likesCsv) && ($h = fopen($likesCsv, 'r')) !== false) {
    while (($row = fgetcsv($h, 0, ',')) !== false) {
        $nid = intval($row[0]);
        $cnt = intval($row[1]);
        $likesMap[$nid] = $cnt;
    }
    fclose($h);
}

// 2) Читаем новости из CSV
$newsData  = [];
$searchStr = strtolower($_GET['search'] ?? '');
$theme     = $_GET['theme'] ?? '';

$newsCsv = __DIR__ . '/../csv_files/news.csv';
if (($fh = fopen($newsCsv, 'r')) !== false) {
    while (($data = fgetcsv($fh, 0, ';')) !== false) {
        // columns: 0=id, 1=title, 2=content, 3=image, 4=date, 5=theme, 6=author
        $id      = intval($data[0]);
        $title   = $data[1];
        $content = $data[2];
        $image   = $data[3];
        $date    = $data[4];
        $th      = $data[5];

        // фильтр по теме
        if (strcasecmp($th, $theme) !== 0 && strcasecmp($theme, 'Toutes') !== 0) {
            continue;
        }
        // фильтр по строке поиска
        if ($searchStr !== ''
            && stripos($title, $searchStr) === false
            && stripos($content, $searchStr) === false
        ) {
            continue;
        }

        $newsData[] = [
            'id'      => $id,
            'image'   => $image,
            'title'   => $title,
            'content' => $content,
            'date'    => $date,
            'likes'   => $likesMap[$id] ?? 0,
        ];
    }
    fclose($fh);
}

echo json_encode($newsData);
exit;
