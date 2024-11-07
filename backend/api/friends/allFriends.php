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

// Récupérer les enregistrements de la table 'followers'
$sql = "SELECT * FROM followers";
$result = $conn->query($sql);

// Vérifier si des enregistrements ont été trouvés
if ($result->num_rows > 0) {
    $followers = [];
    while ($row = $result->fetch_assoc()) {
        $followers[] = [
            'follower_id' => $row['follower_id'],
            'followed_id' => $row['followed_id']
        ];
    }
    
    // Répondre avec les données en format JSON
    http_response_code(200);
    echo json_encode(['status' => 'success', 'data' => $followers]);
} else {
    // Répondre avec un message indiquant qu'il n'y a pas de résultats
    http_response_code(404);
    echo json_encode(['status' => 'success', 'data' => [], 'message' => 'Aucun enregistrement trouvé']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
