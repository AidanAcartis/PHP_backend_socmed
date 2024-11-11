<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Démarrer la session pour accéder à $_SESSION
session_start();

// Vérification de la session
if (!isset($_SESSION['user_logged_in']) || $_SESSION['user_logged_in'] !== true) {
    echo json_encode(["message" => "Utilisateur non authentifié"]);
    exit();
}

$userId = $_SESSION['user_id']; // Récupérer l'ID de l'utilisateur authentifié

// Vérifier la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(["error" => "Erreur de connexion à la base de données"]);
    exit();
}

// Marquer toutes les notifications comme lues
$updateStmt = $conn->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?");
$updateStmt->bind_param("i", $userId);

if ($updateStmt->execute()) {
    //echo json_encode(["message" => "Toutes les notifications ont été marquées comme lues"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Erreur lors de la mise à jour des notifications"]);
}

$updateStmt->close();

// Récupérer toutes les notifications (lues et non lues)
$stmt = $conn->prepare("SELECT n.id, n.actor_id, n.user_id, n.type, n.is_read, n.created_at, u.username 
                        FROM notifications n 
                        JOIN users u ON n.actor_id = u.id 
                        WHERE n.user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$notifications = [];

while ($notification = $result->fetch_assoc()) {
    $postId = null;
    $postOwner = null;

    // Récupérer le `post_id` et le `post_owner` selon le type de notification
    switch ($notification['type']) {
        case 'new_post':
            $postStmt = $conn->prepare("SELECT id FROM posts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $postStmt->bind_param("i", $notification['actor_id']);
            $postStmt->execute();
            $postResult = $postStmt->get_result();
            if ($postRow = $postResult->fetch_assoc()) {
                $postId = $postRow['id'];
            }
            $postStmt->close();
            break;

        case 'comment':
            $commentStmt = $conn->prepare("SELECT post_id FROM comments WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $commentStmt->bind_param("i", $notification['actor_id']);
            $commentStmt->execute();
            $commentResult = $commentStmt->get_result();
            if ($commentRow = $commentResult->fetch_assoc()) {
                $postId = $commentRow['post_id'];
            }
            $commentStmt->close();
            break;

        case 'reaction':
            $reactionStmt = $conn->prepare("SELECT post_id FROM post_reactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 1");
            $reactionStmt->bind_param("i", $notification['actor_id']);
            $reactionStmt->execute();
            $reactionResult = $reactionStmt->get_result();
            if ($reactionRow = $reactionResult->fetch_assoc()) {
                $postId = $reactionRow['post_id'];
            }
            $reactionStmt->close();
            break;

        case 'comment_reaction':
            $commentReactionStmt = $conn->prepare("SELECT c.post_id, p.user_id AS post_owner 
                                                   FROM comments c 
                                                   JOIN comment_reactions cr ON c.id = cr.comment_id 
                                                   JOIN posts p ON c.post_id = p.id 
                                                   WHERE cr.user_id = ? 
                                                   ORDER BY cr.created_at DESC LIMIT 1");
            $commentReactionStmt->bind_param("i", $notification['actor_id']);
            $commentReactionStmt->execute();
            $commentReactionResult = $commentReactionStmt->get_result();
            if ($commentReactionRow = $commentReactionResult->fetch_assoc()) {
                $postId = $commentReactionRow['post_id'];
                $postOwner = $commentReactionRow['post_owner'];
            }
            $commentReactionStmt->close();
            break;

        default:
            $postId = null;
            break;
    }

    $notifications[] = [
        'id' => $notification['id'],
        'user_id' => isset($notification['user_id']) ? $notification['user_id'] : null,
        'actor_id' => $notification['actor_id'],
        'username' => $notification['username'],
        'type' => $notification['type'],
        'is_read' => $notification['is_read'],
        'created_at' => $notification['created_at'],
        'post_id' => $postId,
        'post_owner' => $postOwner
    ];
}

$stmt->close();

if (!empty($notifications)) {
    echo json_encode($notifications);
} else {
    echo json_encode(["message" => "Aucune notification"]);
}

exit();
?>
