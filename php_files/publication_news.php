<?php
$newsData  = [];
$searchStr = strtolower($_GET['search'] ?? '');
$theme     = $_GET['theme'] ?? 'Toutes';

if (($handle = fopen('../csv_files/news.csv', 'r')) !== false) {

    /* указали ; как разделитель  ───▼──── */
    while (($data = fgetcsv($handle, 0, ';')) !== false) {
        //   id ; title ; content ; image ; date ; theme ; author
        $data = array_map('trim', $data);          // убираем \r и пробелы
        if (count($data) < 7) continue;            // пропускаем битые строки

        $themeMatch  = strcasecmp($theme, 'Toutes') === 0 ||
                       strcasecmp($data[5], $theme) === 0;

        $searchMatch = $searchStr === '' ||
                       stripos($data[1], $searchStr) !== false ||
                       stripos($data[2], $searchStr) !== false;

        if ($themeMatch && $searchMatch) {
            $newsData[] = [
                'id'      => $data[0],
                'image'   => $data[3],
                'title'   => $data[1],
                'content' => $data[2],
                'date'    => $data[4],
            ];
        }
    }
    fclose($handle);
}

header('Content-Type: application/json; charset=utf-8');
echo json_encode($newsData);
?>
