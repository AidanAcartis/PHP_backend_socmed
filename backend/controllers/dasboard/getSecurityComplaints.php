<?php
// Gestion des headers CORS et type de contenu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Gérer les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Vérification si l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    error_log("Utilisateur non connecté");
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
    exit();
}

$user_id = $_SESSION['user_id'];

// Étape 1 : Récupérer la description et le signalement_id
$sql_signalement = "SELECT id AS signalement_id, description 
                    FROM signalements 
                    WHERE user_id = ? 
                    ORDER BY id DESC 
                    LIMIT 1";

$stmt = $conn->prepare($sql_signalement);
if (!$stmt) {
    error_log("Erreur de préparation de la requête signalements : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la requête signalements']);
    exit();
}

$stmt->bind_param("i", $user_id);
$stmt->execute();
$result_signalement = $stmt->get_result();

if ($result_signalement->num_rows === 0) {
    echo json_encode(['status' => 'error', 'message' => 'Aucun signalement trouvé pour cet utilisateur']);
    exit();
}

$signalement = $result_signalement->fetch_assoc();
$signalement_id = $signalement['signalement_id'];
$description = $signalement['description'];
$stmt->close();

// Étape 2 : Récupérer les données dans security_complaints
$sql_security = "SELECT * 
                 FROM security_complaints 
                 WHERE signalement_id = ?";

$stmt = $conn->prepare($sql_security);
if (!$stmt) {
    error_log("Erreur de préparation de la requête security_complaints : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la requête security_complaints']);
    exit();
}

$stmt->bind_param("i", $signalement_id);
$stmt->execute();
$result_security = $stmt->get_result();

$security_complaint = $result_security->fetch_assoc();
$stmt->close();

// Étape 3 : Récupérer les deux dernières lignes dans status_history
$sql_history = "SELECT * 
                FROM status_history 
                WHERE security_complaint_id = ? 
                ORDER BY id DESC 
                LIMIT 2";

$stmt = $conn->prepare($sql_history);
if (!$stmt) {
    error_log("Erreur de préparation de la requête status_history : " . $conn->error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la requête status_history']);
    exit();
}

$stmt->bind_param("i", $signalement_id);
$stmt->execute();
$result_history = $stmt->get_result();

$status_history = [];
while ($row = $result_history->fetch_assoc()) {
    $status_history[] = $row;
}
$stmt->close();

// Réponse JSON
echo json_encode([
    'status' => 'success',
    'data' => [
        'description' => $description,
        'security_complaint' => $security_complaint,
        'status_history' => $status_history
    ]
]);

$conn->close();
?>
