<?php
$id = $_GET['id']; 


function getNewsById($id) {
    if (($handle = fopen("../csv_files/news.csv", "r")) !== FALSE) {
        while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
            if ($data[0] == $id) {
                return $data;
            }
        }
        fclose($handle);
    }
    return null;
}

$news = getNewsById($id);
?>
<!DOCTYPE html>
<html>
<head>
    <title><?php echo $news[1]; ?></title>
    <link rel="stylesheet" type="text/css" href="../styles/news_page.css">


    
</head>
<body>
    <div class="full-news">	
        <h1><?php echo $news[1]; ?></h1>

        <div class="container">
            <img src="<?php echo htmlspecialchars($news[3], ENT_QUOTES, 'UTF-8'); ?>" alt="image" width="500" >
        </div>
    
        <p><?php echo $news[2]; ?></p>
        
        <div class="auteur-date">
            <p><?php echo $news[5]; ?></p>
            <p><?php echo $news[6]; ?></p>
        </div>

        <a href="../html/main.html">Retour à la page principale</a>
    </div>
</body>
</html>

