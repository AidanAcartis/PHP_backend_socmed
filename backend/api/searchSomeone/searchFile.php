<?php
// Headers for CORS and JSON content type
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Start session for authentication, if needed
session_start();

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Handle preflight OPTIONS request for CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Include the database configuration
require_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Check if the username parameter is provided
if (isset($_GET['username']) && !empty($_GET['username'])) {
    $username = $_GET['username'];

    // Échappement pour sécuriser la requête
    $username_safe = $conn->real_escape_string($username);

    // SQL query for partial match with LIKE
    $query = "
        SELECT u.id, u.username, u.email, u.created_at, u.role, p.photo_path
        FROM users u
        LEFT JOIN profile_photo p ON u.id = p.user_id
        WHERE u.username LIKE '%$username_safe%'
        ORDER BY u.username
    ";

    $result = $conn->query($query);

    if ($result) {
        // Fetch and return the results as an associative array
        $users = $result->fetch_all(MYSQLI_ASSOC);
        echo json_encode($users);
    } else {
        // Return error message if the query fails
        echo json_encode(['error' => 'Erreur dans la requête SQL']);
    }

} else {
    // Handle missing username parameter
    echo json_encode(['error' => 'No username provided']);
}
?>
