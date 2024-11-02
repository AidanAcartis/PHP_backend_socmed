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

include '../../../config/config.php'; // Connexion à la base de données via config.php

// Vérifier si la connexion à la base de données est établie
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = intval($_GET['id']); // Convertir en entier pour éviter toute injection

        // Récupérer doc_url du post avant suppression
        $sql_get_doc_url = "SELECT doc_url FROM posts WHERE id = ?";
        $stmt_get_doc_url = $conn->prepare($sql_get_doc_url);
        if (!$stmt_get_doc_url) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour doc_url : ' . $conn->error]);
            exit();
        }

        $stmt_get_doc_url->bind_param("i", $id);
        $stmt_get_doc_url->execute();
        $stmt_get_doc_url->bind_result($doc_url);
        $stmt_get_doc_url->fetch();
        $stmt_get_doc_url->close();

        // Supprimer les commentaires associés à ce post
        deleteComments($conn, $id);

        // Supprimer l'enregistrement dans uploaded_documents si doc_url n'est pas vide
      
if (!empty($doc_url)) {
    // Extraire le chemin du fichier à partir de l'URL
    $parsed_url = parse_url($doc_url);
    $file_path = $_SERVER['DOCUMENT_ROOT'] . $parsed_url['path']; // Crée le chemin absolu du fichier

    // Supprimer le fichier du système de fichiers
    if (file_exists($file_path)) {
        if (!unlink($file_path)) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la suppression du fichier : ' . $file_path]);
            exit();
        }
    } else {
        echo json_encode(['message' => 'Fichier non trouvé : ' . $file_path]);
    }

    // Supprimer l'enregistrement dans uploaded_documents
    $sql_delete_uploaded_document = "DELETE FROM uploaded_documents WHERE doc_url = ?";
    $stmt_delete_uploaded_document = $conn->prepare($sql_delete_uploaded_document);
    if (!$stmt_delete_uploaded_document) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour uploaded_documents : ' . $conn->error]);
        exit();
    }
    $stmt_delete_uploaded_document->bind_param("s", $doc_url);
    $stmt_delete_uploaded_document->execute();
    $stmt_delete_uploaded_document->close();
}

        // Supprimer le post dans la table posts
        $sql_post = "DELETE FROM posts WHERE id = ?";
        $stmt_post = $conn->prepare($sql_post);
        if (!$stmt_post) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour le post : ' . $conn->error]);
            exit();
        }

        $stmt_post->bind_param("i", $id);
        if ($stmt_post->execute()) {
            updatePostsJson($conn);
            http_response_code(200);
            echo json_encode(['message' => 'Post et ses commentaires supprimés avec succès']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la suppression du post : ' . $stmt_post->error]);
        }
        $stmt_post->close();
    } else {
        http_response_code(400);
        echo json_encode(['message' => 'ID manquant ou invalide']);
    }
    updateUserFileJson($conn);
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Méthode HTTP non autorisée']);
}

// Fonction pour supprimer les commentaires d'un post donné
function deleteComments($conn, $post_id) {
    $sql_get_comments = "SELECT id FROM comments WHERE post_id = ?";
    $stmt_get_comments = $conn->prepare($sql_get_comments);
    $stmt_get_comments->bind_param("i", $post_id);
    $stmt_get_comments->execute();
    $stmt_get_comments->bind_result($comment_id);

    // Récupérer tous les IDs des commentaires à supprimer
    $comment_ids = [];
    while ($stmt_get_comments->fetch()) {
        $comment_ids[] = $comment_id;
    }
    $stmt_get_comments->close(); // Fermer le statement ici

    // Supprimer chaque commentaire récupéré
    foreach ($comment_ids as $id) {
        deleteComment($conn, $id);
    }

    updateCommentsJson($conn);
    updateCommentReactionsJson($conn);
}


// Fonction pour supprimer un commentaire spécifique
function deleteComment($conn, $comment_id) {
    $sql_delete_reactions = "DELETE FROM comment_reactions WHERE comment_id = ?";
    $stmt_delete_reactions = $conn->prepare($sql_delete_reactions);
    if (!$stmt_delete_reactions) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour les réactions : ' . $conn->error]);
        return;
    }

    $stmt_delete_reactions->bind_param("i", $comment_id);
    $stmt_delete_reactions->execute();
    $stmt_delete_reactions->close();

    $sql_delete_comment = "DELETE FROM comments WHERE id = ?";
    $stmt_delete_comment = $conn->prepare($sql_delete_comment);
    if (!$stmt_delete_comment) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour le commentaire : ' . $conn->error]);
        return;
    }

    $stmt_delete_comment->bind_param("i", $comment_id);
    $stmt_delete_comment->execute();
    $stmt_delete_comment->close();
}

// Fonction pour mettre à jour le fichier JSON avec les posts actuels
function updatePostsJson($conn) {
    $sql = "SELECT id, content, user_id, created_at, comment_count, doc_type, doc_url FROM posts";
    $result = $conn->query($sql);
    $posts = [];

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
    }
    if (file_put_contents('../createPost/posts.json', json_encode($posts, JSON_PRETTY_PRINT)) === false) {
        http_response_code(500);
        echo json_encode(['message' => 'Erreur lors de la mise à jour du fichier JSON']);
        exit();
    }
}

function updateUserFileJson($conn) {
    // Vider le fichier userFile.json avant d'ajouter de nouvelles données
    file_put_contents('../createPost/userFile.json', json_encode([])); // Créer un fichier vide

    // Récupérer les données de uploaded_documents
    $result = $conn->query("SELECT * FROM uploaded_documents");
    $documents = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        // Écrire les nouvelles données dans le fichier JSON
        file_put_contents('../createPost/userFile.json', json_encode($documents, JSON_PRETTY_PRINT));
    }
}

// Fonction pour mettre à jour le fichier comments.json
function updateCommentsJson($conn) {
    $sql = "SELECT * FROM comments";
    $result = $conn->query($sql);
    $commentsArray = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    file_put_contents('../../comments/comments.json', json_encode($commentsArray, JSON_PRETTY_PRINT));
}

// Fonction pour mettre à jour le fichier commentReaction.json
function updateCommentReactionsJson($conn) {
    $sql = "SELECT * FROM comment_reactions";
    $result = $conn->query($sql);
    $reactions = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    file_put_contents('../../comments/commentReaction.json', json_encode($reactions, JSON_PRETTY_PRINT));
}
?>
