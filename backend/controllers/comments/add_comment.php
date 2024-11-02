<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données
error_log("Début de l'exécution de add_comment.php");

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(204);
    exit();
}

// Récupération des données du corps de la requête
$data = json_decode(file_get_contents("php://input"));

// Vérification des erreurs de décodage JSON
if (json_last_error() !== JSON_ERROR_NONE) {
    error_log("Erreur de décodage JSON : " . json_last_error_msg());
    http_response_code(400);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de décodage JSON : ' . json_last_error_msg()]);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    error_log("Requête POST reçue");

    // Vérification de la connexion de l'utilisateur
    if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
        $userId = $_SESSION['user_id'];
        error_log("Utilisateur connecté avec user_id : $userId");

        // Vérification des données envoyées
        if (isset($data->postId) && isset($data->content)) {
            $postId = (int) $data->postId;
            $content = mysqli_real_escape_string($conn, trim($data->content)); // Assurez-vous que $conn est encore valide
            error_log("postId : $postId, content : $content");

            if ($postId <= 0 || $userId <= 0 || trim($content) === '') {
                error_log("Données invalides : postId ou content non valide");
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'Données invalides']);
                exit();
            }

            // Insertion du commentaire dans la table comments
            $sql = "INSERT INTO comments (post_id, user_id, content, created_at) VALUES (?, ?, ?, NOW())";
            $stmt = $conn->prepare($sql);

            if ($stmt === false) {
                error_log("Erreur de préparation de la requête : " . $conn->error);
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur de préparation de la requête : ' . $conn->error]);
                exit();
            }

            $stmt->bind_param("iis", $postId, $userId, $content);

            if ($stmt->execute()) {
                error_log("Commentaire ajouté avec succès, ID : " . $stmt->insert_id);
                updateCommentCount($conn, $postId);
                updatePostsJson($conn);
                updateCommentsJson($conn);

                // Écrire l'userId dans userId.txt
                file_put_contents('./userId.txt', $userId);

                echo json_encode(['status' => 'success', 'message' => 'Commentaire ajouté avec succès']);
            } else {
                error_log("Erreur lors de l'ajout du commentaire : " . $stmt->error);
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'ajout du commentaire : ' . $stmt->error]);
            }

            $stmt->close();
        } else {
            error_log("Données manquantes : postId ou content non fourni");
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Données manquantes']);
        }
    } else {
        error_log("Utilisateur non connecté");
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
    }
} else {
    error_log("Méthode HTTP non autorisée");
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode HTTP non autorisée']);
}

// Fonction pour mettre à jour le nombre de commentaires dans la table posts
function updateCommentCount($conn, $postId) {
    error_log("Mise à jour du nombre de commentaires pour postId : $postId");
    $sql = "SELECT COUNT(*) as comment_count FROM comments WHERE post_id = ?";
    $stmt = $conn->prepare($sql);

    if ($stmt === false) {
        error_log("Erreur lors du comptage des commentaires : " . $conn->error);
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
        error_log("Erreur lors de la mise à jour de comment_count : " . $conn->error);
        return;
    }

    $updateStmt->bind_param("ii", $commentCount, $postId);
    $updateStmt->execute();
    $updateStmt->close();
}

// Fonction pour mettre à jour le fichier posts.json
function updatePostsJson($conn) {
    error_log("Mise à jour du fichier posts.json");
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
            error_log("Erreur lors de la mise à jour du fichier posts.json");
        }
    }
}

// Fonction pour mettre à jour le fichier comments.json
function updateCommentsJson($conn) {
    error_log("Mise à jour du fichier comments.json");
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
            error_log("Erreur lors de la mise à jour du fichier comments.json");
        }
    }
}

// Fermer la connexion
$conn->close();
?>
