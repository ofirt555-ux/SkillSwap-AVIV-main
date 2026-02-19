<?php
session_start();
require_once "db_connect.php";

if ($_SERVER["REQUEST_METHOD"] == "POST") {

    if (!isset($_SESSION["user_id"])) {
        die("You must be logged in to post a job.");
    }

    $user_id = $_SESSION["user_id"];
    $title = $_POST["job_title"];
    $description = $_POST["job_description"];
    $category = $_POST["category"];

    $sql = "INSERT INTO jobs (user_id, job_title, job_description, category)
            VALUES (?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isss", $user_id, $title, $description, $category);

    if ($stmt->execute()) {
        header("Location: ../Includes/MyJobs.html");
        exit();
    } else {
        echo "Error posting job.";
    }

    $stmt->close();
    $conn->close();
}
?>
