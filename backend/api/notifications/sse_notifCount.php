<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: text/event-stream'); // Important pour SSE
header('Cache-Control: no-cache');
header('Connection: keep-alive');

// Demander à PHP de ne pas garder de session pendant la gestion de cet événement
session_start();

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Vérifier la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo "data: Erreur de connexion à la base de données\n\n";
    flush();
    exit();
}

// Vérifier que l'utilisateur est connecté et récupérer son ID
if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
    $userId = $_SESSION['user_id'];

    // Compter le nombre de notifications non lues pour l'utilisateur
    $stmt = $conn->prepare("SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = ? AND is_read = 0");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $unreadCount = $row['unread_count'];
    $stmt->close();

    // Envoyer les données sous forme de message texte SSE
    echo "data: {\"unread_count\": $unreadCount}\n\n"; // Changement ici pour éviter d'envoyer un JSON encodé
    flush();

    // Fin de la connexion SSE
    echo "data: Fin de la vérification des notifications\n\n";
    flush();
    exit();
} else {
    echo "data: Utilisateur non authentifié\n\n";
    flush();
    exit();
}
?>
