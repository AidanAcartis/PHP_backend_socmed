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

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Récupérer les données des signalements et des plaintes
$sql = "
    SELECT 
        s.id, 
        s.date, 
        s.description, 
        sc.current_status, 
        sc.priority, 
        sc.responsible_service
    FROM signalements s
    LEFT JOIN security_complaints sc ON s.id = sc.signalement_id
";

$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $complaints = [];
    while ($row = $result->fetch_assoc()) {
        $complaints[] = $row; // Chaque ligne inclut désormais l'id du signalement
    }
    echo json_encode(["status" => "success", "data" => $complaints]);
} else {
    echo json_encode(["status" => "error", "message" => "Aucune donnée trouvée"]);
}

// Fermer la connexion
$conn->close();
?>
