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

         // Écrire l'userId dans userId.txt
         //file_put_contents('../users/userId.txt', $userId);

        // Vérifier que les champs requis sont présents
        if (isset($data['postId'], $data['reaction'])) {
            $postId = $data['postId'];
            $reaction = $data['reaction'];

            // Vérifier si une réaction existe déjà pour cet utilisateur et ce post
            $stmt = $conn->prepare("SELECT id FROM post_reactions WHERE user_id = ? AND post_id = ?");
            $stmt->bind_param("ii", $userId, $postId);
            $stmt->execute();
            $stmt->store_result();

            if ($stmt->num_rows > 0) {
                // Mettre à jour la réaction existante
                $updateStmt = $conn->prepare("UPDATE post_reactions SET reaction_type = ?, created_at = CURRENT_TIMESTAMP WHERE user_id = ? AND post_id = ?");
                $updateStmt->bind_param("sii", $reaction, $userId, $postId);
                if ($updateStmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Réaction mise à jour']);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour de la réaction']);
                }
                $updateStmt->close();
            } else {
                // Insérer une nouvelle réaction
                $insertStmt = $conn->prepare("INSERT INTO post_reactions (post_id, user_id, reaction_type) VALUES (?, ?, ?)");
                $insertStmt->bind_param("iis", $postId, $userId, $reaction);
                if ($insertStmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Réaction ajoutée']);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout de la réaction']);
                }
                $insertStmt->close();
            }

            $stmt->close();

            // Mettre à jour le fichier JSON avec les données de la base de données
            updateReactionsJson($conn);
        } else {
            // Répondre avec un message d'erreur si les données sont invalides
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
        }
    } else {
        // Répondre avec un message d'erreur si l'utilisateur n'est pas authentifié
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non authentifié']);
        exit();
    }
} else {
    // Répondre avec un message d'erreur pour les méthodes non autorisées
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}

// Fonction pour mettre à jour le fichier reactions.json avec les données de la table post_reactions
function updateReactionsJson($conn) {
    $filePath = './reactions.json';
    $query = "SELECT post_id, user_id, reaction_type, created_at FROM post_reactions";
    $result = $conn->query($query);

    if ($result) {
        $reactions = [];
        while ($row = $result->fetch_assoc()) {
            $reactions[] = [
                'postId' => $row['post_id'],
                'userId' => $row['user_id'],
                'reaction' => $row['reaction_type'],
                'createdAt' => $row['created_at']
            ];
        }
        // Enregistrer les réactions mises à jour dans le fichier JSON
        file_put_contents($filePath, json_encode($reactions));
    } else {
        error_log("Erreur lors de la récupération des données : " . $conn->error);
    }
}

?>
