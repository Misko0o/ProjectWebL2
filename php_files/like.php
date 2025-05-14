<?php
header('Content-Type: application/json; charset=utf-8');

$input  = json_decode(file_get_contents('php://input'), true);
$id     = isset($input['id'])     ? intval($input['id'])     : 0;
$remove = !empty($input['remove']);  

$csv = __DIR__ . '/../csv_files/likes.csv';
$likes = [];

if (file_exists($csv) && ($f = fopen($csv, 'r')) !== false) {
    while (($row = fgetcsv($f, 0, ',')) !== false) {
        $nid = intval($row[0]);
        $cnt = intval($row[1]);
        $likes[$nid] = $cnt;
    }
    fclose($f);
}

if ($id > 0) {
    if ($remove) {
        $likes[$id] = max(0, ($likes[$id] ?? 0) - 1);
    } else {
        $likes[$id] = ($likes[$id] ?? 0) + 1;
    }
}

if (($f = fopen($csv, 'w')) !== false) {
    foreach ($likes as $nid => $cnt) {
        fputcsv($f, [$nid, $cnt]);
    }
    fclose($f);
}

echo json_encode(['likes' => $likes[$id] ?? 0]);
exit;
