<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle CORS preflight (OPTIONS) requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../config/config.php'; // Database connection via config.php

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Decode JSON input and validate data
$data = json_decode(file_get_contents("php://input"), true);
if (!$data || !isset($data['follower_id']) || !isset($data['followed_id'])) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Données de suivi invalides']);
    exit();
}

$follower_id = $data['follower_id'];
$followed_id = $data['followed_id'];

// Prepare and execute the SQL statement
$query = "INSERT INTO followers (follower_id, followed_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE follower_id = follower_id";
$stmt = $conn->prepare($query);
$stmt->bind_param("ii", $follower_id, $followed_id);

if ($stmt->execute()) {
    // Insert notification into the notifications table
    $notification_type = 'follow';
    $is_read = 0;  // New notifications are unread

    // Insert notification with actor_id (follower_id)
    $notification_query = "INSERT INTO notifications (user_id, actor_id, type, is_read) VALUES (?, ?, ?, ?)";
    $notification_stmt = $conn->prepare($notification_query);
    $notification_stmt->bind_param("iisi", $followed_id, $follower_id, $notification_type, $is_read);

    if ($notification_stmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Utilisateur suivi et notification envoyée']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'envoi de la notification : ' . $notification_stmt->error]);
    }

    $notification_stmt->close();
} else {
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors du suivi']);
}

$stmt->close();
$conn->close();
?>
