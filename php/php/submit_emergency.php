<?php

header("Content-Type: application/json");

$host = "127.0.0.1";
$dbname = "IDREMIS";
$username = "root";
$password = "";

$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed."
    ]);
    exit;
}

$firstName = $_POST["firstName"] ?? "";
$middleInitial = $_POST["middleInitial"] ?? "";
$lastName = $_POST["lastName"] ?? "";
$phoneNumber = $_POST["phoneNumber"] ?? "";
$location = $_POST["location"] ?? "";
$emergencyType = $_POST["emergency_type"] ?? "";
$selectedTags = $_POST["selected_tags"] ?? "";
$additionalDetails = $_POST["additionalDetails"] ?? "";

if (
    empty($firstName) ||
    empty($lastName) ||
    empty($phoneNumber) ||
    empty($location) ||
    empty($emergencyType)
) {
    echo json_encode([
        "success" => false,
        "message" => "Please complete all required fields."
    ]);
    exit;
}

$sql = "INSERT INTO emergency_requests
        (first_name, middle_initial, last_name, phone_number, location, emergency_type, selected_tags, additional_details)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ssssssss",
    $firstName,
    $middleInitial,
    $lastName,
    $phoneNumber,
    $location,
    $emergencyType,
    $selectedTags,
    $additionalDetails
);

if ($stmt->execute()) {
    echo json_encode([
        "success" => true,
        "message" => "Emergency request submitted successfully.",
        "request_id" => $stmt->insert_id
    ]);
} else {
    echo json_encode([
        "success" => false,
        "message" => "Failed to save emergency request."
    ]);
}

$stmt->close();
$conn->close();

?>