<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, UPDATE");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

session_start();
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Démarrer la session pour accéder à $_SESSION

// Vérification de la session
if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
    echo json_encode(["message" => "Utilisateur non authentifié"]);
    exit();
}

$userId = $_SESSION['user_id']; // Récupérer l'ID de l'utilisateur authentifié

// Vérifier la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion à la base de données"]);
    exit();
}

// Marquer toutes les notifications comme lues
$updateStmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
$updateStmt->bind_param("i", $userId);

if ($updateStmt->execute()) {
    echo json_encode(["message" => "Toutes les notifications ont été marquées comme lues"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la mise à jour des notifications"]);
}

$updateStmt->close();
$conn->close();
exit();
?>
