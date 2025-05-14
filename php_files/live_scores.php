<?php
header('Content-Type: application/json; charset=utf-8');
$apiKey = '1fe69bd04162416f8f480fc3d428dc64';

// если нет ключа, сразу возвращаем демо-данные:
if (!$apiKey || $apiKey === '1fe69bd04162416f8f480fc3d428dc64') {
  echo json_encode([
    "Ligue 1 · PSG 2-0 Lyon (70')",
    "PL · Arsenal 1-1 Chelsea (HT)",
    "RG · Alcaraz 6-4 6-3 Zverev"
  ]);
  exit;
}

$url = 'https://api.football-data.org/v2/matches?status=LIVE';
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-Auth-Token: $apiKey"]);
$response = curl_exec($ch);
$code     = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($code !== 200) {
  // если что-то пошло не так, отдадим демо-данные
  echo json_encode([
    "Ligue 1 · PSG 2-0 Lyon (70')",
    "PL · Arsenal 1-1 Chelsea (HT)",
    "RG · Alcaraz 6-4 6-3 Zverev"
  ]);
  exit;
}

$data    = json_decode($response, true);
$matches = $data['matches'] ?? [];
$out     = [];

foreach ($matches as $m) {
  $comp     = $m['competition']['name'];
  $home     = $m['homeTeam']['name'];
  $away     = $m['awayTeam']['name'];
  $ft       = $m['score']['fullTime'];
  $score    = ($ft['homeTeam'] ?? 0) . '-' . ($ft['awayTeam'] ?? 0);
  $minute   = isset($m['minute']) ? " ({$m['minute']}')" : '';
  $out[]    = "$comp · $home $score $away$minute";
}

echo json_encode($out);
