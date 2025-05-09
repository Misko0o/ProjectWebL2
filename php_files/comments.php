<?php
    $id = $_GET['id'];
    if (isset($_GET['json'])) {
        header('Content-Type: application/json');
        echo json_encode(get_comments($id)); // функция, читающая CSV
        exit;
    }
    
    function getNameAndSurnameByEmail($email){
        if (($handle = fopen("../csv_files/users.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if ($data[2] == $email) {
                    
                    return $data[0] . " " . $data[1];
                }
            }
            fclose($handle);
        }
        return "NULL";
    }

    function getCommentsByPostId($id) {
        $commentsData = [];
        if (($handle = fopen("../csv_files/comments.csv", "r")) !== FALSE) {
            while (($data = fgetcsv($handle, 1000, ",")) !== FALSE) {
                if ($data[0] == $id) {
                    $commentsData[] = [
                        "author" => $data[2],
                        "text" => $data[1],
                        "date" => $data[3]
                    ];
                }
            }
            fclose($handle);
        }
        return $commentsData;
    }

    $comments = getCommentsByPostId($id);
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comments</title>
  <link rel="stylesheet" href="../styles/comments.css">
</head>

<body>
  <div id="content-container">

    <!-- список комментариев -->
    <div id="comments-list">
      <?php
        for ($i = 0; $i < count($comments); $i++) {
          ?>
            <div class="comment" id="<?php echo $i; ?>">
              <h3><?php echo getNameAndSurnameByEmail(trim($comments[$i]['author'])); ?></h3>
              <p><?php echo $comments[$i]['text']; ?></p>
              <p><?php echo $comments[$i]['date']; ?></p>
            </div>
          <?php
        }
      ?>
    </div>

    <!-- форма добавления -->
    <div id="create-comment-container">
      <input type="text" placeholder="Write a comment…">
      <button>Post</button>
    </div>

  </div>

  <!-- скрипт после DOM и как ES-модуль -->
  <script type="module" src="../scripts/comments.js"></script>
</body>
</html>
