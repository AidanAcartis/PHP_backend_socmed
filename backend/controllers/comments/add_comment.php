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

// Récupération des données du corps de la requête
$data = json_decode(file_get_contents("php://input"));

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
        
        // Vérification des données envoyées
        if (isset($data->postId) && isset($data->content)) {
            // Validation et nettoyage des données
            $postId = (int) $data->postId;
            $content = mysqli_real_escape_string($conn, trim($data->content));

            if ($postId <= 0 || $userId <= 0 || trim($content) === '') {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
                exit();
            }

            // Insertion du commentaire dans la table comments
            $sql = "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())";
            $stmt = $conn->prepare($sql);

            if ($stmt === false) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête : ' . $conn->error]);
                exit();
            }

            $stmt->bind_param("iis", $postId, $userId, $content);

            if ($stmt->execute()) {
                // Mise à jour du nombre de commentaires dans la table posts
                updateCommentCount($conn, $postId);
                updatePostsJson($conn); // Mise à jour du fichier JSON

                // Mettre à jour le fichier comments.json
                updateCommentsJson($conn);

                // Écrire l'userId dans userId.txt
                file_put_contents('./userId.txt', $userId);

                echo json_encode(['status' => 'success', 'message' => 'Commentaire ajouté avec succès']);
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du commentaire : ' . $stmt->error]);
            }

            $stmt->close();
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Données manquantes']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode HTTP non autorisée']);
}

// Fonction pour mettre à jour le nombre de commentaires dans la table posts
function updateCommentCount($conn, $postId) {
    $sql = "SELECT COUNT(*) as comment_count FROM comments WHERE post_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors du comptage des commentaires : ' . $conn->error]);
        return;
    }

    $stmt->bind_param("i", $postId);
    $stmt->execute();
    $stmt->bind_result($commentCount);
    $stmt->fetch();
    $stmt->close();

    $updateSql = "UPDATE posts SET comment_count = ? WHERE id = ?";
    $updateStmt = $conn->prepare($updateSql);

    if ($updateStmt === false) {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour de comment_count : ' . $conn->error]);
        return;
    }

    $updateStmt->bind_param("ii", $commentCount, $postId);
    $updateStmt->execute();
    $updateStmt->close();
}

// Fonction pour mettre à jour le fichier posts.json
function updatePostsJson($conn) {
    $sql = "SELECT * FROM posts";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $postsArray = [];
        while ($row = $result->fetch_assoc()) {
            $postsArray[] = $row;
        }
        $jsonData = json_encode($postsArray, JSON_PRETTY_PRINT);
        $filePath = '../posts/createPost/posts.json';
        if (!file_put_contents($filePath, $jsonData)) {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour du fichier posts.json']);
        }
    }
}

// Fonction pour mettre à jour le fichier comments.json
function updateCommentsJson($conn) {
    $sql = "SELECT * FROM comments";
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

// Fermer la connexion
$conn->close();
?>
