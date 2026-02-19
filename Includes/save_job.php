<?php
require_once __DIR__ . "/db_connect.php";


$title       = trim($_POST["title"] ?? "");
$category    = trim($_POST["category"] ?? "");
$credits     = (int)($_POST["credits"] ?? 0);
$description = trim($_POST["description"] ?? "");
$location    = trim($_POST["location"] ?? "");
$deadline    = trim($_POST["deadline"] ?? "");


if ($title === "" || $category === "" || $credits <= 0 || $description === "" || $location === "") {
	die("Missing required fields");
}

if ($deadline === "") {
	$deadline = null;
}


$sql = "INSERT INTO jobs (title, category, credits, description, location, deadline)
				VALUES (?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("ssisss", $title, $category, $credits, $description, $location, $deadline);

if ($stmt->execute() === FALSE) {
	die("DB error: " . $stmt->error);
}

header("Location: MyJobs.html?job=added");
exit();
?>
