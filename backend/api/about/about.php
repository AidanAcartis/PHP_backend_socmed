<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

include_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Répondre aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérification de la méthode POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Lire les données JSON du corps de la requête
    $data = json_decode(file_get_contents('php://input'), true);

    // Vérification des données
    $user_id = isset($data['user_id']) ? intval($data['user_id']) : null;
    $description = isset($data['description']) ? $conn->real_escape_string($data['description']) : null;

    if ($user_id === null || empty($description)) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'Les champs user_id et description sont requis.']);
        exit();
    }

    // Vérifier si un enregistrement existe déjà
    $check_sql = "SELECT * FROM about WHERE user_id = '$user_id'";
    $result = $conn->query($check_sql);

    if ($result->num_rows > 0) {
        // Mettre à jour l'enregistrement existant
        $update_sql = "UPDATE about SET description='$description' WHERE user_id='$user_id'";
        if ($conn->query($update_sql) === TRUE) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Description mise à jour avec succès.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour des données : ' . $conn->error]);
        }
    } else {
        // Insérer un nouvel enregistrement
        $insert_sql = "INSERT INTO about (user_id, description) VALUES ('$user_id', '$description')";
        if ($conn->query($insert_sql) === TRUE) {
            http_response_code(200);
            echo json_encode(['status' => 'success', 'message' => 'Description ajoutée avec succès.']);
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion des données : ' . $conn->error]);
        }
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
}

$conn->close();
?>
