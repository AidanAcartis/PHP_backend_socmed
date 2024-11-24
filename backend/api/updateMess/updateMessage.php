<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Démarrer la session pour accéder à $_SESSION
session_start();

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

// Marquer tous les messages non lus comme lus pour l'utilisateur
$updateStmt = $conn->prepare("UPDATE private_messages SET is_read = 1 WHERE receiver_id = ? AND is_read = 0");
$updateStmt->bind_param("i", $userId);

if ($updateStmt->execute()) {
    echo json_encode(["message" => "Tous les messages non lus ont été marqués comme lus"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la mise à jour des messages non lus"]);
}

$updateStmt->close();
?>
