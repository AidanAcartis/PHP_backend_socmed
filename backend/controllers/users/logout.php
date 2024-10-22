<?php
// Ajoutez les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON

error_reporting(E_ALL);
ini_set('display_errors', 1);
require_once '../../config/config.php'; // Assurez-vous que ce chemin est correct

// Vérifiez si la connexion est réussie
if (!isset($conn)) {
    http_response_code(500);
    echo json_encode(["message" => "Erreur de connexion à la base de données."]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    session_start();

    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["message" => "Non autorisé"]);
        exit;
    }

    $userId = $_SESSION['user_id'];

    try {
        // Démarrer une transaction
        $conn->begin_transaction();

        // Suppression des réactions associées
        $stmt = $conn->prepare("DELETE FROM comment_reactions WHERE user_id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        // Suppression des commentaires associés
        $stmt = $conn->prepare("DELETE FROM comments WHERE user_id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        // Suppression des réactions aux posts
        $stmt = $conn->prepare("DELETE FROM post_reactions WHERE user_id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        // Suppression des posts de l'utilisateur
        $stmt = $conn->prepare("DELETE FROM posts WHERE user_id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        // Suppression de l'utilisateur de la table 'users'
        $stmt = $conn->prepare("DELETE FROM users WHERE id = ?");
        $stmt->bind_param('i', $userId);
        $stmt->execute();

        // Commit de la transaction
        $conn->commit();

        // Suppression de la session
        session_destroy();

        http_response_code(200);
        echo json_encode(["message" => "Déconnexion réussie et données supprimées."]);
    } catch (Exception $e) {
        // Rollback en cas d'erreur
        $conn->rollback();
        http_response_code(500);
        echo json_encode(["message" => "Erreur lors de la suppression des données.", "error" => $e->getMessage()]);
    } finally {
        // Fermer la déclaration
        $stmt->close();
    }
} else {
    http_response_code(405);
    echo json_encode(["message" => "Méthode non autorisée"]);
}

// Fermer la connexion
$conn->close();
?>
