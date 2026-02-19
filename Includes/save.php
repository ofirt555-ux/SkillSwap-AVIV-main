<?php
require_once __DIR__ . "/db_connect.php";

$actionType = $_POST["actionType"] ?? "";
if ($actionType !== "signup") {
	die("Invalid actionType");
}

$firstName = trim($_POST["firstName"] ?? "");
$lastName  = trim($_POST["lastName"] ?? "");
$email     = trim($_POST["email"] ?? "");
$password  = trim($_POST["password"] ?? "");
$confirm   = trim($_POST["confirmPassword"] ?? "");

// skills[] לא נכניס ל-DB כרגע (אין עמודה לזה)
$skillsArr = $_POST["skills"] ?? [];
if (!is_array($skillsArr)) $skillsArr = [$skillsArr];

if ($firstName === "" || $lastName === "" || $email === "" || $password === "") {
	die("Missing fields");
}
if ($password !== $confirm) {
	die("Passwords do not match");
}

$fullName = $firstName . " " . $lastName;

$sql = "INSERT INTO users (full_name, email, password)
				VALUES (?, ?, ?)";

$stmt = $conn->prepare($sql);
$stmt->bind_param("sss", $fullName, $email, $password);

if ($stmt->execute() === FALSE) {
	die("DB error: " . $stmt->error);
}

header("Location: ../Includes/SignUp.html?signup=success");
exit();
?>
