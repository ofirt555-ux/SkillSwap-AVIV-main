<?php
$host = "localhost";
$user = "avivfe_SSAdmin";
$pass = "Felernoob123";
$db   = "avivfe_SkillSwapDB";

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>