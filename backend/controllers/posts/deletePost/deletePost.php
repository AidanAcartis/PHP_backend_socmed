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

if (!$conn) {
    http_response_code(500);
    echo json_encode(['message' => 'Erreur de connexion à la base de données']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Récupérer l'ID du post à supprimer depuis l'URL
    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $id = intval($_GET['id']); // Convertir en entier pour éviter toute injection

        // Préparer et exécuter la requête SQL pour supprimer le post
        $sql = "DELETE FROM posts WHERE id = ?";
        $stmt = $conn->prepare($sql);

        if (!$stmt) {
            http_response_code(500);
            echo json_encode(['message' => 'Erreur de préparation de la requête SQL : ' . $conn->error]);
            exit();
        }

        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            // Si le post est supprimé avec succès, mettre à jour le fichier JSON
            updatePostsJson($conn);

            // Réponse de succès
            http_response_code(200); // Code HTTP pour succès
            echo json_encode(['message' => 'Post supprimé avec succès']);
        } else {
            http_response_code(500); // Erreur interne du serveur
            echo json_encode(['message' => 'Erreur lors de la suppression du post : ' . $stmt->error]);
        }

        $stmt->close();
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
    $sql = "SELECT * FROM posts";
    $result = $conn->query($sql);
    $posts = [];

    if ($result->num_rows > 0) {
        // Remplir le tableau $posts avec les données actuelles
        while($row = $result->fetch_assoc()) {
            $posts[] = [
                'id' => $row['id'],
                'content' => $row['content'],
                'user_id' => $row['user_id'],
                'created_at' => $row['created_at']
            ];
        }

        // Écrire le contenu dans posts.json
        file_put_contents('../createPost/posts.json', json_encode($posts));
    }
}
?>
