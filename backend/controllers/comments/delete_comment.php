<?php
// Headers pour permettre les requêtes CORS (pour le frontend JS)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, DELETE");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);


// Gérer les pré-requêtes CORS (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include '../../config/config.php'; // Connexion à la base de données via config.php

// Vérifier la connexion à la base de données
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

            // Mise à jour des fichiers JSON
            updatePostsJson($conn);
            updateCommentsJson($conn); // Mise à jour des commentaires JSON
            updateCommentReactionsJson($conn); // Mise à jour des réactions JSON

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

// Fonction pour mettre à jour le fichier JSON des posts
function updatePostsJson($conn) {
    $sql = "SELECT id, content, user_id, created_at, comment_count, doc_type, doc_url FROM posts";
    $result = $conn->query($sql);
    $posts = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
        file_put_contents('../posts/createPost/posts.json', json_encode($posts, JSON_PRETTY_PRINT));
    }
}

// Fonction pour mettre à jour le fichier comments.json
function updateCommentsJson($conn) {
    // Sélectionner toutes les données de la table comments
    $sql = "SELECT * FROM comments";
    $result = $conn->query($sql);

    $commentsArray = [];
    if ($result && $result->num_rows > 0) {
        // Récupérer chaque ligne de résultat et l'ajouter au tableau des commentaires
        while ($row = $result->fetch_assoc()) {
            $commentsArray[] = $row;
        }
        // Écrire le contenu dans comments.json
        file_put_contents('./comments.json', json_encode($commentsArray, JSON_PRETTY_PRINT));
    } else {
        file_put_contents('./comments.json', json_encode([])); // Écrire un tableau vide si aucun commentaire trouvé
    }
}

// Fonction pour mettre à jour le fichier commentReaction.json
function updateCommentReactionsJson($conn) {
    // Sélectionner toutes les données de la table comment_reactions
    $sql = "SELECT * FROM comment_reactions";
    $result = $conn->query($sql);

    $reactions = [];
    if ($result && $result->num_rows > 0) {
        // Récupérer chaque ligne de résultat et l'ajouter au tableau des réactions
        while ($row = $result->fetch_assoc()) {
            $reactions[] = $row;
        }
        // Écrire le contenu dans commentReaction.json
        file_put_contents('./commentReaction.json', json_encode($reactions, JSON_PRETTY_PRINT));
    } else {
        file_put_contents('./commentReaction.json', json_encode([])); // Écrire un tableau vide si aucune réaction trouvée
    }
}

?>
