<?php
// Headers pour permettre les requêtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();

// Connexion à la base de données
include '../../config/config.php';

// Gérer les pré-requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204); // Pas de contenu pour une requête OPTIONS
    exit();
}

try {
    // Préparer la requête pour récupérer toutes les preuves
    $query = "SELECT id, signalement_id, file_path, file_type, created_at FROM preuves";
    $stmt = $conn->prepare($query);

    if (!$stmt) {
        throw new Exception("Erreur lors de la préparation de la requête : " . $conn->error);
    }

    $stmt->execute();
    $result = $stmt->get_result();

    // Vérifier si des preuves ont été trouvées
    if ($result->num_rows === 0) {
        http_response_code(404); // Ressource non trouvée
        echo json_encode(['status' => 'error', 'message' => 'Aucune preuve trouvée']);
        exit();
    }

    // Construire la réponse JSON avec les preuves
    $proofs = [];
    while ($row = $result->fetch_assoc()) {
        $proofs[] = $row;
    }

    // Retourner les preuves sous forme de JSON
    http_response_code(200);
    echo json_encode(['status' => 'success', 'data' => $proofs]);

} catch (Exception $e) {
    // Gérer les erreurs
    http_response_code(500); // Erreur interne du serveur
    echo json_encode(['status' => 'error', 'message' => 'Erreur serveur', 'details' => $e->getMessage()]);
}

// Fermer la connexion
$stmt->close();
$conn->close();
?>
