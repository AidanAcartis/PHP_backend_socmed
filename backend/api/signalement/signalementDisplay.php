<?php
// Gestion des headers CORS et type de contenu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Démarrage de la session
session_start();

// Activation des rapports d'erreurs pour le développement
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclusion du fichier de configuration pour la base de données
include '../../config/config.php'; // Modifiez le chemin si nécessaire

// Log de démarrage pour le débogage
error_log("Début de l'exécution du fichier signalement.php");

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(204); // Pas de contenu pour les OPTIONS
    exit();
}

// Vérifier que l'ID est fourni dans la requête
if (!isset($_GET['id']) || empty($_GET['id'])) {
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'error', 'message' => 'ID du signalement requis']);
    exit();
}

$id = intval($_GET['id']); // Sécurisation de l'ID
$stmt = $conn->prepare("SELECT * FROM signalements WHERE id = ?");
if (!$stmt) {
    error_log("Erreur lors de la préparation de la requête : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur interne du serveur']);
    exit();
}

$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();

// Vérification des résultats de la requête
if ($row = $result->fetch_assoc()) {
    echo json_encode($row);
} else {
    error_log("Signalement non trouvé pour l'ID : $id");
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Signalement introuvable']);
}

// Fermeture de la requête et de la connexion
$stmt->close();
$conn->close();
