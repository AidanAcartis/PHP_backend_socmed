<?php
// Gestion des headers CORS et type de contenu
header("Access-Control-Allow-Origin: http://localhost:3000"); // Permet l'accès depuis localhost:3000
header("Access-Control-Allow-Methods: GET, POST, OPTIONS"); // Permet les méthodes GET, POST, OPTIONS
header("Access-Control-Allow-Credentials: true"); // Autorise les cookies avec les requêtes
header("Access-Control-Allow-Headers: Content-Type, Authorization"); // Permet l'en-tête Authorization
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

// Gérer les requêtes OPTIONS pour CORS (pour les requêtes préliminaires)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Répondre avec les bons en-têtes CORS pour la requête préliminaire
    error_log("Requête OPTIONS reçue");
    http_response_code(204); // Pas de contenu pour les OPTIONS
    exit();
}

// Vérifier si l'utilisateur est connecté (id de la session ou autre mécanisme d'authentification)
if (!isset($_SESSION['user_id'])) {
    error_log("Utilisateur non connecté");
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
    exit();
}

// Récupérer l'id de l'utilisateur connecté
$user_id = $_SESSION['user_id'];

// Préparer la requête pour sélectionner les données des signalements de l'utilisateur connecté
$sql = "
    SELECT sc.*, s.full_name, s.location, s.date, s.description 
    FROM security_complaints sc
    JOIN signalements s ON sc.signalement_id = s.id
    WHERE s.user_id = ?";
    
$stmt = $conn->prepare($sql);

// Vérifier si la requête est préparée correctement
if (!$stmt) {
    error_log("Erreur de préparation de la requête : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête']);
    exit();
}

// Lier les paramètres (user_id)
$stmt->bind_param("i", $user_id);

// Exécuter la requête
$stmt->execute();

// Récupérer le résultat de la requête
$result = $stmt->get_result();

// Vérifier si un résultat a été trouvé
if ($result->num_rows > 0) {
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    echo json_encode(['status' => 'success', 'data' => $data]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Aucun signalement trouvé pour cet utilisateur']);
}

// Fermer la déclaration et la connexion
$stmt->close();
$conn->close();
?>
