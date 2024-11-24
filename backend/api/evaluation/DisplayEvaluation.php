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

// Récupérer le signalement_id envoyé par le frontend
$signalement_id = isset($_GET['signalement_id']) ? $_GET['signalement_id'] : null;

if ($signalement_id === null) {
    error_log("Le paramètre signalement_id est manquant");
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Le paramètre signalement_id est manquant']);
    exit();
}

// Requête SQL pour récupérer les évaluations par signalement_id
$sql = "SELECT * FROM evaluations WHERE signalement_id = ?";
$stmt = $conn->prepare($sql);

if (!$stmt) {
    error_log("Erreur de préparation de la requête : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête']);
    exit();
}

// Lier les paramètres et exécuter la requête
$stmt->bind_param("i", $signalement_id);
$stmt->execute();

// Récupérer les résultats
$result = $stmt->get_result();
$evaluations = [];

while ($row = $result->fetch_assoc()) {
    $evaluations[] = $row;
}

// Fermer la connexion
$stmt->close();

// Vérifier si des évaluations ont été trouvées
if (count($evaluations) > 0) {
    echo json_encode(['status' => 'success', 'evaluations' => $evaluations]);
} else {
    echo json_encode(['status' => 'success', 'evaluations' => []]); // Pas d'évaluations trouvées
}

// Fermer la connexion à la base de données
$conn->close();
?>
