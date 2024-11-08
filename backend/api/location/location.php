<?php
// Entêtes HTTP
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');


// Démarrer la session et activer les erreurs
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclure le fichier de configuration pour la connexion à la base de données
include_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Répondre aux requêtes OPTIONS pour gérer le preflight request CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Ces en-têtes doivent être renvoyés lors de la requête OPTIONS
    http_response_code(200);
    exit();
}

// Récupérer les données envoyées depuis le frontend (JSON)
$inputData = json_decode(file_get_contents("php://input"), true);

// Vérifier si les données sont valides
if (!isset($inputData['user_id']) || !isset($inputData['country']) || !isset($inputData['city'])) {
    http_response_code(400); // Mauvaise requête
    echo json_encode(['status' => 'error', 'message' => 'Les données sont incomplètes.']);
    exit();
}

$user_id = $inputData['user_id'];
$country = $inputData['country'];
$city = $inputData['city'];

// Vérifier si l'utilisateur existe déjà dans la table `location`
$query = "SELECT * FROM location WHERE user_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // L'utilisateur existe, on met à jour les données
    $updateQuery = "UPDATE location SET country = ?, city = ? WHERE user_id = ?";
    $updateStmt = $conn->prepare($updateQuery);
    $updateStmt->bind_param("ssi", $country, $city, $user_id);

    if ($updateStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Les données ont été mises à jour.']);
    } else {
        http_response_code(500); // Erreur lors de la mise à jour
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour des données.']);
    }
} else {
    // L'utilisateur n'existe pas, on insère de nouvelles données
    $insertQuery = "INSERT INTO location (user_id, country, city) VALUES (?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $insertStmt->bind_param("iss", $user_id, $country, $city);

    if ($insertStmt->execute()) {
        echo json_encode(['status' => 'success', 'message' => 'Les données ont été insérées avec succès.']);
    } else {
        http_response_code(500); // Erreur lors de l'insertion
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion des données.']);
    }
}

// Fermer la connexion
$stmt->close();
$conn->close();
?>
