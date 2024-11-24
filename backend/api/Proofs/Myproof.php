<?php
// CORS headers and content type
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Start session
session_start();

// Check if the user is logged in (ensure that session is active and user ID exists)
if (!isset($_SESSION['user_id'])) {
    http_response_code(403);
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
    exit();
}

// Include config file for database connection
include '../../config/config.php';

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

// Check database connection
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Handle OPTIONS requests for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Retrieve all signalements for the logged-in user
$query = "SELECT * FROM signalements WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

// Check if signalements are found
if ($result->num_rows > 0) {
    $signalements = [];
    while ($row = $result->fetch_assoc()) {
        $signalements[] = $row;
    }

    // Return the signalements data as JSON
    echo json_encode(['status' => 'success', 'signalements' => $signalements]);
} else {
    // If no signalements are found, send an appropriate message
    echo json_encode(['status' => 'error', 'message' => 'Aucun signalement trouvé pour cet utilisateur']);
}
?>
