<?php
// Headers pour permettre les requêtes CORS (pour le frontend JS)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Gérer les pré-requêtes CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../config/config.php'; // Connexion à la base de données via config.php

// Vérifier si la connexion à la base de données est établie
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer l'ID du commentaire à supprimer depuis l'URL
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $comment_id = intval($_GET['id']); // Convertir en entier pour éviter toute injection

        // Récupérer l'ID du post associé au commentaire
        $sql_get_post_id = "SELECT post_id FROM comments WHERE id = ?";
        $stmt_get_post_id = $conn->prepare($sql_get_post_id);
        $stmt_get_post_id->bind_param("i", $comment_id);
        $stmt_get_post_id->execute();
        $stmt_get_post_id->bind_result($post_id);
        $stmt_get_post_id->fetch();
        $stmt_get_post_id->close();

        if ($post_id) {
            // Supprimer les réactions du commentaire
            $sql_delete_reactions = "DELETE FROM comment_reactions WHERE comment_id = ?";
            $stmt_delete_reactions = $conn->prepare($sql_delete_reactions);
            
            if (!$stmt_delete_reactions) {
                http_response_code(500);
                echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour les réactions : ' . $conn->error]);
                exit();
            }

            $stmt_delete_reactions->bind_param("i", $comment_id);
            $stmt_delete_reactions->execute();
            $stmt_delete_reactions->close();

            // Supprimer le commentaire
            $sql_delete_comment = "DELETE FROM comments WHERE id = ?";
            $stmt_delete_comment = $conn->prepare($sql_delete_comment);
            
            if (!$stmt_delete_comment) {
                http_response_code(500);
                echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour le commentaire : ' . $conn->error]);
                exit();
            }

            $stmt_delete_comment->bind_param("i", $comment_id);
            $stmt_delete_comment->execute();
            $stmt_delete_comment->close();

            // Réduire le nombre de commentaires dans le post
            $sql_update_post = "UPDATE posts SET comment_count = comment_count - 1 WHERE id = ?";
            $stmt_update_post = $conn->prepare($sql_update_post);
            
            if (!$stmt_update_post) {
                http_response_code(500);
                echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour la mise à jour du post : ' . $conn->error]);
                exit();
            }

            $stmt_update_post->bind_param("i", $post_id);
            $stmt_update_post->execute();
            $stmt_update_post->close();

            // Mise à jour du fichier posts.json après la suppression du commentaire
            updatePostsJson($conn);
            updateCommentsJson($conn);

            // Réponse de succès
            http_response_code(200);
            echo json_encode(['message' => 'Commentaire et ses réactions supprimés avec succès']);
        } else {
            http_response_code(404); // Le commentaire n'a pas été trouvé
            echo json_encode(['message' => 'Commentaire introuvable']);
        }
    } else {
        http_response_code(400); // Mauvaise requête si l'ID est manquant ou invalide
        echo json_encode(['message' => 'ID manquant ou invalide']);
    }
} else {
    http_response_code(405); // Mauvaise méthode HTTP
    echo json_encode(['message' => 'Méthode HTTP non autorisée. Méthode reçue : ' . $_SERVER['REQUEST_METHOD']]);
}

// Fonction pour mettre à jour le fichier JSON avec les posts actuels
function updatePostsJson($conn) {
    // Récupérer tous les posts actuels depuis la base de données
    $sql = "SELECT id, content, user_id, created_at, photos, comment_count FROM posts";
    $result = $conn->query($sql);
    $posts = [];

    if ($result->num_rows > 0) {
        // Remplir le tableau $posts avec les données actuelles
        while($row = $result->fetch_assoc()) {
            $posts[] = [
                'id' => $row['id'],
                'content' => $row['content'],
                'user_id' => $row['user_id'],
                'created_at' => $row['created_at'],
                'photos' => $row['photos'],
                'comment_count' => $row['comment_count']
            ];
        }

        // Écrire le contenu dans posts.json
        if (file_put_contents('../posts/createPost/posts.json', json_encode($posts, JSON_PRETTY_PRINT)) === false) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la mise à jour du fichier JSON']);
            exit();
        }
    }
}

// Fonction pour mettre à jour le fichier comments.json
function updateCommentsJson($conn) {
    $sql = "SELECT c.id, c.post_id, c.user_id, c.content, c.created_at, u.username 
            FROM comments c 
            JOIN users u ON c.user_id = u.id";

    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $commentsArray = [];
        while ($row = $result->fetch_assoc()) {
            $commentsArray[] = $row;
        }
        $jsonData = json_encode($commentsArray, JSON_PRETTY_PRINT);
        $filePath = './comments.json';
        if (!file_put_contents($filePath, $jsonData)) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour du fichier comments.json']);
        }
    }
}
?>
