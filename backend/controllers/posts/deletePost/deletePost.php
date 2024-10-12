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

include '../../../config/config.php'; // Connexion à la base de données via config.php

// Vérifier si la connexion à la base de données est établie
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer l'ID du post à supprimer depuis l'URL
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = intval($_GET['id']); // Convertir en entier pour éviter toute injection

        // Supprimer les commentaires associés à ce post dans la table comments
        $sql_comments = "DELETE FROM comments WHERE post_id = ?";
        $stmt_comments = $conn->prepare($sql_comments);
        
        if (!$stmt_comments) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour les commentaires : ' . $conn->error]);
            exit();
        }

        $stmt_comments->bind_param("i", $id);
        $stmt_comments->execute();
        $stmt_comments->close();

        // Supprimer le post dans la table posts
        $sql_post = "DELETE FROM posts WHERE id = ?";
        $stmt_post = $conn->prepare($sql_post);

        if (!$stmt_post) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur de préparation de la requête SQL pour le post : ' . $conn->error]);
            exit();
        }

        $stmt_post->bind_param("i", $id);

        // Si la suppression du post est réussie
        if ($stmt_post->execute()) {
            // Mise à jour du fichier posts.json après suppression
            updatePostsJson($conn);

            // Réponse de succès
            http_response_code(200);
            echo json_encode(['message' => 'Post et ses commentaires supprimés avec succès']);
        } else {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la suppression du post : ' . $stmt_post->error]);
        }

        $stmt_post->close();
    } else {
        http_response_code(400); // Mauvaise requête si l'ID est manquant ou invalide
        echo json_encode(['message' => 'ID manquant ou invalide']);
    }
} else {
    http_response_code(405); // Mauvaise méthode HTTP
    echo json_encode(['message' => 'Méthode HTTP non autorisée']);
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
        if (file_put_contents('../createPost/posts.json', json_encode($posts, JSON_PRETTY_PRINT)) === false) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur lors de la mise à jour du fichier JSON']);
            exit();
        }
    }
}
?>
