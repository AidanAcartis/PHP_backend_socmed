<?php

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start(); // Start the session
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclusion du fichier de configuration pour la connexion à la base de données
include_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if user is logged in by verifying session
    if (isset($_SESSION['userId'])) {
        $userId = $_SESSION['userId']; // Get userId from session
    } else {
        echo json_encode(['status' => 'error', 'message' => 'User not authenticated']);
        exit;
    }

    // Get the JSON data from the request body
    $data = json_decode(file_get_contents('php://input'), true);

    // Check if required fields are present
    if (isset($data['postId'], $data['reaction'])) {
        $postId = $data['postId'];
        $reaction = $data['reaction'];

        // Prepare the reaction data
        $reactionData = [
            'userId' => $userId,
            'postId' => $postId,
            'reaction' => $reaction,
            'timestamp' => time() // Store the timestamp if needed
        ];

        // Load existing reactions from JSON file
        $filePath = './reactions.json';
        $existingReactions = [];

        if (file_exists($filePath)) {
            $existingReactions = json_decode(file_get_contents($filePath), true);
        }

        // Append the new reaction
        $existingReactions[] = $reactionData;

        // Save the updated reactions back to the file
        file_put_contents($filePath, json_encode($existingReactions));

        // Send a success response
        echo json_encode(['status' => 'success']);
    } else {
        // Invalid input response
        echo json_encode(['status' => 'error', 'message' => 'Invalid input']);
    }
} else {
    // Method not allowed response
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Method not allowed']);
}
?>
