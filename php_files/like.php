<?php
header('Content-Type: application/json; charset=utf-8');

// получаем входящий JSON
$input  = json_decode(file_get_contents('php://input'), true);
$id     = isset($input['id'])     ? intval($input['id'])     : 0;
$remove = !empty($input['remove']);  // если передан remove:true — снимем лайк

$csv = __DIR__ . '/../csv_files/likes.csv';
$likes = [];

// 1) читаем все текущие лайки в массив $likes[id] = count
if (file_exists($csv) && ($f = fopen($csv, 'r')) !== false) {
    while (($row = fgetcsv($f, 0, ',')) !== false) {
        $nid = intval($row[0]);
        $cnt = intval($row[1]);
        $likes[$nid] = $cnt;
    }
    fclose($f);
}

// 2) модифицируем счётчик для $id
if ($id > 0) {
    if ($remove) {
        // не ниже 0
        $likes[$id] = max(0, ($likes[$id] ?? 0) - 1);
    } else {
        $likes[$id] = ($likes[$id] ?? 0) + 1;
    }
}

// 3) записываем обратно
if (($f = fopen($csv, 'w')) !== false) {
    foreach ($likes as $nid => $cnt) {
        fputcsv($f, [$nid, $cnt]);
    }
    fclose($f);
}

// 4) возвращаем текущее значение лайков для этой новости
echo json_encode(['likes' => $likes[$id] ?? 0]);
exit;
