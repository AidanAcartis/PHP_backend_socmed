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

// Gérer les requêtes OPTIONS (pré-vol)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Récupération des données de la requête
$data = json_decode(file_get_contents("php://input"), true);
$commentId = $data['comment_id'];
$userId = $data['user_id'];
$reactionType = $data['reaction_type'];

// Vérifier si l'utilisateur a déjà réagi au commentaire
$stmt = $conn->prepare("SELECT reaction_type FROM comment_reactions WHERE comment_id = ? AND user_id = ?");
$stmt->bind_param("ii", $commentId, $userId);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // L'utilisateur a déjà réagi, mettre à jour la réaction existante
    $stmt = $conn->prepare("UPDATE comment_reactions SET reaction_type = ? WHERE comment_id = ? AND user_id = ?");
    $stmt->bind_param("sii", $reactionType, $commentId, $userId);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Réaction mise à jour avec succès."]);
    } else {
        echo json_encode(["success" => false, "error" => "Erreur lors de la mise à jour de la réaction: " . $stmt->error]);
    }
} else {
    // L'utilisateur n'a pas encore réagi, ajouter une nouvelle réaction
    $stmt = $conn->prepare("INSERT INTO comment_reactions (comment_id, user_id, reaction_type) VALUES (?, ?, ?)");
    $stmt->bind_param("iis", $commentId, $userId, $reactionType);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "Réaction ajoutée avec succès."]);
    } else {
        echo json_encode(["success" => false, "error" => "Erreur lors de l'ajout de la réaction: " . $stmt->error]);
    }
}

// Fonction pour exporter les données de la table comment_reactions dans un fichier JSON
function exportCommentReactionsToJson($conn) {
    $query = "SELECT * FROM comment_reactions";
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $reactions = [];

        while ($row = $result->fetch_assoc()) {
            $reactions[] = $row;
        }

        // Convertir les données en JSON
        $jsonData = json_encode($reactions, JSON_PRETTY_PRINT);

        // Écrire les données JSON dans le fichier commentReaction.json
        if (file_put_contents('./commentReaction.json', $jsonData)) {
            echo json_encode(["success" => true, "message" => "Données exportées dans commentReaction.json"]);
        } else {
            echo json_encode(["success" => false, "error" => "Erreur lors de l'écriture des données dans le fichier JSON."]);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Aucune donnée trouvée dans la table comment_reactions."]);
    }
}

// Appeler la fonction pour exporter les données
exportCommentReactionsToJson($conn);

// Fermer la connexion
$stmt->close();
$conn->close();
?>
