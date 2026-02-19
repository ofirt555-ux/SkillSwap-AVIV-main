<?php
require_once __DIR__ . "/db_connect.php";

error_reporting(E_ALL);
ini_set('display_errors', 1);

$title       = trim($_POST["title"] ?? "");
$category    = trim($_POST["category"] ?? "");
$credits     = (int)($_POST["credits"] ?? 0);
$description = trim($_POST["description"] ?? "");
$location    = trim($_POST["location"] ?? "");
$deadline    = trim($_POST["deadline"] ?? "");

// Required fields
if ($title === "" || $category === "" || $credits <= 0 || $description === "" || $location === "") {
  die("Missing required fields");
}

// OPTIONAL: handle image (won't block insert if missing)
$imagePath = null;
if (!empty($_FILES["jobImage"]["name"]) && $_FILES["jobImage"]["error"] === UPLOAD_ERR_OK) {
  $uploadDir = __DIR__ . "/../images/uploads/";
  if (!is_dir($uploadDir)) {
    mkdir($uploadDir, 0755, true);
  }

  $ext = strtolower(pathinfo($_FILES["jobImage"]["name"], PATHINFO_EXTENSION));
  $allowed = ["jpg", "jpeg", "png", "webp"];
  if (in_array($ext, $allowed, true)) {
    $newName = "job_" . time() . "_" . bin2hex(random_bytes(4)) . "." . $ext;
    $destAbs = $uploadDir . $newName;

    if (move_uploaded_file($_FILES["jobImage"]["tmp_name"], $destAbs)) {
      $imagePath = "images/uploads/" . $newName; // path you can store in DB if you add a column
    }
  }
}

// Deadline handling (NULL safe)
if ($deadline === "") {
  $sql = "INSERT INTO jobs (title, category, credits, description, location)
          VALUES (?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  if (!$stmt) die("Prepare failed: " . $conn->error);

  $stmt->bind_param("ssiss", $title, $category, $credits, $description, $location);
} else {
  $sql = "INSERT INTO jobs (title, category, credits, description, location, deadline)
          VALUES (?, ?, ?, ?, ?, ?)";
  $stmt = $conn->prepare($sql);
  if (!$stmt) die("Prepare failed: " . $conn->error);

  $stmt->bind_param("ssisss", $title, $category, $credits, $description, $location, $deadline);
}

if (!$stmt->execute()) {
  die("DB error: " . $stmt->error);
}

$stmt->close();
$conn->close();

header("Location: MyJobs.html?job=added");
exit;
