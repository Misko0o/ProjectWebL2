<?php
// expects JSON {id:123}
$data = json_decode(file_get_contents('php://input'), true);
$id   = intval($data['id'] ?? 0);

$csv = '../csv_files/likes.csv';
$likes = [];
if (file_exists($csv)){
  $likes = array_map('str_getcsv', file($csv));
}
$found = false;
foreach($likes as &$row){
  if ($row[0] == $id){
    $row[1] = intval($row[1]) + 1;
    $found = true;
  }
}

if (!$found) {
    $likes[] = [$id, 1];
}

$fp = fopen($csv, 'w');
foreach ($likes as $r) {
    fputcsv($fp, $r);
}
fclose($fp);


$currentLikes = 0;
foreach ($likes as $r) {
    if ($r[0] == $id) {
        $currentLikes = $r[1];
        break;
    }
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode(['likes' => $currentLikes]);