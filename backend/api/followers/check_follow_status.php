<?php
// check_follow_status.php

// Headers pour gérer les requêtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Gérer les requêtes OPTIONS pour le pré-vol des CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Inclure le fichier de configuration pour la connexion à la base de données
include '../../config/config.php'; // Assurez-vous que le chemin est correct

// Vérification de la connexion de l'utilisateur
if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
    $follower_id = $_SESSION['user_id']; // Récupérer l'ID de l'utilisateur connecté
    error_log("Utilisateur connecté avec user_id : $follower_id");
} else {
    http_response_code(401);
    echo json_encode(['message' => 'Utilisateur non connecté.']);
    exit();
}

// Récupérer l'ID de l'utilisateur cible depuis la requête GET
$followed_id = $_GET['userId'] ?? null; // ID de l'utilisateur cible

// Vérifier si l'ID de l'utilisateur cible est fourni
if (!$followed_id) {
    http_response_code(400);
    echo json_encode(['message' => 'Identifiants manquants.']);
    exit();
}

try {
    // Préparer la requête pour vérifier si l'utilisateur suit déjà la cible
    $sql = "SELECT * FROM followers WHERE follower_id = ? AND followed_id = ?";
    $stmt = $conn->prepare($sql);

    // Lier les paramètres
    $stmt->bind_param("ii", $follower_id, $followed_id); // "ii" signifie que les paramètres sont des entiers (integer)
    
    // Exécuter la requête
    $stmt->execute();
    
    // Récupérer les résultats
    $result = $stmt->get_result();

    // Déterminer si l'utilisateur est suivi
    $isFollowing = $result->num_rows > 0;
    echo json_encode(['isFollowing' => $isFollowing]);
    
    // Fermer la connexion
    $stmt->close();
} catch (mysqli_sql_exception $e) {
    // Gestion de l'erreur
    http_response_code(500);
    echo json_encode(['error' => 'Erreur de serveur']);
}

?>
