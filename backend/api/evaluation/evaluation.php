<?php
// create_post.php

// Set the necessary headers for CORS and content type
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Start the session and set error reporting
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database configuration file
include('../../config/config.php');

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Respond to OPTIONS requests (CORS pre-flight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier que l'utilisateur est connecté
if (!isset($_SESSION['user_id'])) {
    http_response_code(401); // Unauthorized
    echo json_encode(['status' => 'error', 'message' => 'Utilisateur non authentifié']);
    exit();
}

// Vérifier si la méthode est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données envoyées par le client
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Vérifier si les champs nécessaires sont présents
    if (
        !isset($data['clarity']) || !isset($data['effectiveness']) ||
        !isset($data['response_time']) || !isset($data['empathy']) ||
        !isset($data['comment'])
    ) {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Tous les champs sont requis.']);
        exit();
    }

    // Extraire les valeurs des données
    $clarity = $data['clarity'];
    $effectiveness = $data['effectiveness'];
    $response_time = $data['response_time'];
    $empathy = $data['empathy'];
    $comment = $data['comment'];
    $user_id = $_SESSION['user_id']; // L'utilisateur connecté

    // Récupérer le dernier signalement_id pour l'utilisateur connecté
    $query_signalement = "SELECT id FROM signalements WHERE user_id = ? ORDER BY id DESC LIMIT 1";
    
    if ($stmt_signalement = $conn->prepare($query_signalement)) {
        // Lier l'ID de l'utilisateur pour récupérer son dernier signalement
        $stmt_signalement->bind_param("i", $user_id);

        // Exécuter la requête
        $stmt_signalement->execute();
        $result_signalement = $stmt_signalement->get_result();

        // Vérifier si un signalement existe
        if ($result_signalement->num_rows > 0) {
            // Récupérer le signalement_id
            $row = $result_signalement->fetch_assoc();
            $signalement_id = $row['id'];

            // Préparer la requête d'insertion dans la table evaluations
            $query = "INSERT INTO evaluations (signalement_id, user_id, clarity, effectiveness, response_time, empathy, comment) 
                      VALUES (?, ?, ?, ?, ?, ?, ?)";

            // Préparer la déclaration
            if ($stmt = $conn->prepare($query)) {
                // Lier les paramètres
                $stmt->bind_param("iiiiiis", $signalement_id, $user_id, $clarity, $effectiveness, $response_time, $empathy, $comment);

                // Exécuter la requête
                if ($stmt->execute()) {
                    http_response_code(200); // OK
                    echo json_encode(['status' => 'success', 'message' => 'Évaluation enregistrée avec succès !']);
                } else {
                    http_response_code(500); // Internal Server Error
                    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'enregistrement de l\'évaluation.']);
                }

                // Fermer la déclaration
                $stmt->close();
            } else {
                http_response_code(500); // Internal Server Error
                echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête d\'évaluation.']);
            }
        } else {
            http_response_code(404); // Not Found
            echo json_encode(['status' => 'error', 'message' => 'Aucun signalement trouvé pour cet utilisateur.']);
        }

        // Fermer la déclaration de signalement
        $stmt_signalement->close();
    } else {
        http_response_code(500); // Internal Server Error
        echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête pour récupérer le signalement.']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée.']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
