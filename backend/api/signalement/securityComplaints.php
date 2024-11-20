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

// Récupérer les données envoyées par le formulaire
$data = json_decode(file_get_contents("php://input"), true);

// Vérification si les données sont présentes
if (empty($data['signalement_id']) || empty($data['responsible_service']) || empty($data['next_step']) || empty($data['current_status'])) {
    echo json_encode(["error" => "Certaines données sont manquantes."]);
    exit();
}

// Assurez-vous que signalement_id est un entier
$signalement_id = (int)$data['signalement_id'];
$responsible_service = $data['responsible_service'];
$next_step = $data['next_step'];
$next_date = $data['next_date'];
$current_status = $data['current_status'];
$service_comments = $data['service_comments'];
$priority = $data['priority'];

// Échapper les données pour éviter les problèmes de syntaxe SQL
$responsible_service = mysqli_real_escape_string($conn, $responsible_service);
$next_step = mysqli_real_escape_string($conn, $next_step);
$next_date = mysqli_real_escape_string($conn, $next_date);
$current_status = mysqli_real_escape_string($conn, $current_status);
$service_comments = mysqli_real_escape_string($conn, $service_comments);
$priority = mysqli_real_escape_string($conn, $priority);

// Vérification si le signalement_id existe déjà
$sql_check = "SELECT * FROM security_complaints WHERE signalement_id = '$signalement_id'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Si le signalement_id existe déjà, on effectue une mise à jour
    $sql_update = "UPDATE security_complaints 
                   SET responsible_service = '$responsible_service',
                       next_step = '$next_step',
                       next_date = '$next_date',
                       current_status = '$current_status',
                       service_comments = '$service_comments',
                       priority = '$priority'
                   WHERE signalement_id = '$signalement_id'";

    if ($conn->query($sql_update) === TRUE) {
        echo json_encode(["message" => "Données mises à jour avec succès"]);
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour des données: " . $conn->error]);
    }
} else {
    // Si le signalement_id n'existe pas, on effectue une insertion
    $sql_insert = "INSERT INTO security_complaints (signalement_id, responsible_service, next_step, next_date, current_status, service_comments, priority) 
                   VALUES ('$signalement_id', '$responsible_service', '$next_step', '$next_date', '$current_status', '$service_comments', '$priority')";

    if ($conn->query($sql_insert) === TRUE) {
        echo json_encode(["message" => "Données insérées avec succès"]);
    } else {
        echo json_encode(["error" => "Erreur lors de l'insertion des données: " . $conn->error]);
    }
}

// Fermer la connexion
$conn->close();
?>
