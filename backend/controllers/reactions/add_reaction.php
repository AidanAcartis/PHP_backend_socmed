<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();

include '../../config/config.php'; // Connexion à la base de données

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

  // Récupérer les données JSON envoyées dans la requête
  $data = json_decode(file_get_contents('php://input'), true);

// Vérification des erreurs de décodage JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de décodage JSON : ' . json_last_error_msg()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérification de la connexion de l'utilisateur
    if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
        $userId = $_SESSION['user_id'];

    
    // Vérifier que les champs requis sont présents
    if (isset($data['postId'], $data['reaction'])) {
        $postId = $data['postId'];
        $reaction = $data['reaction'];

        // Préparer les données de la réaction
        $reactionData = [
            'userId' => $userId,
            'postId' => $postId,
            'reaction' => $reaction,
            'timestamp' => time() // Ajouter un timestamp si nécessaire
        ];

        // Charger les réactions existantes depuis le fichier JSON
        $filePath = './reactions.json';
        $existingReactions = [];

        if (file_exists($filePath)) {
            $existingReactions = json_decode(file_get_contents($filePath), true);
        }

        // Ajouter la nouvelle réaction
        $existingReactions[] = $reactionData;

        // Enregistrer les réactions mises à jour dans le fichier JSON
        file_put_contents($filePath, json_encode($existingReactions));

        // Répondre avec un message de succès
        echo json_encode(['status' => 'success']);
    } else {
        // Répondre avec un message d'erreur si les données sont invalides
        http_response_code(400); // Statut 400 Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
    }

    } else {
        // Répondre avec un message d'erreur si l'utilisateur n'est pas authentifié
        http_response_code(401); // Statut 401 Unauthorized
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non authentifié']);
        exit();
    }
} else {
    // Répondre avec un message d'erreur pour les méthodes non autorisées
    http_response_code(405); // Statut 405 Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}
?>
