<?php
require_once __DIR__ . "/db_connect.php";

$email    = trim($_POST["email"] ?? "");
$password = trim($_POST["password"] ?? "");

if ($email === "" || $password === "") {
  die("Missing email or password");
}

$sql = "SELECT id, full_name, credits
        FROM users
        WHERE email = ? AND password = ?
        LIMIT 1";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ss", $email, $password);
$stmt->execute();

$res = $stmt->get_result();

if ($res && $res->num_rows === 1) {
  // הצלחה - כרגע בלי SESSION, רק מפנים
  header("Location: ../index.html?login=success");
  exit();
}

// כישלון - מחזירים לעמוד עם פרמטר
header("Location: ../Includes/SignUp.html?login=fail");
exit();
?>
