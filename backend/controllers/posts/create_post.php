<?php
// Ajoutez les en-têtes CORS pour autoriser les requêtes depuis votre frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON

// Démarrage de la session
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclusion du fichier de configuration pour la connexion à la base de données
include_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Répondre aux requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérifier si la méthode de la requête est POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer le corps de la requête (le texte du post)
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data['text'])) {
        // Nettoyer les données (prévention contre les injections SQL)
        $postText = mysqli_real_escape_string($conn, trim($data['text']));

        // Debugging session
        print_r($_SESSION); // Afficher les variables de session pour le débogage

        // Vérifier si l'utilisateur est connecté
        if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
            $userId = $_SESSION['user_id'];

            // Créer la requête SQL pour insérer le post dans la base de données
            $sql = "INSERT INTO posts (user_id, content, created_at) VALUES ('$userId', '$postText', NOW())";

            if ($conn->query($sql) === TRUE) {
                // Si l'insertion est réussie, retourner l'ID du post créé
                $postId = $conn->insert_id;

                // Créer un tableau de réponse
                $response = [
                    'status' => 'success',
                    'message' => 'Post créé avec succès',
                    'post_id' => $postId,
                    'user_logged_in' => $_SESSION['user_logged_in'],
                    'user_id' => $userId
                ];

                // Sauvegarder les données dans un fichier JSON
                file_put_contents('data.json', json_encode($response));

                // Appeler get_post.php pour mettre à jour post.json
                include './get_posts.php'; // Inclure get_post.php ici

                // Afficher la réponse
                http_response_code(201); // Created
                echo json_encode($response);
            } else {
                http_response_code(500); // Internal Server Error
                echo json_encode(['status' => 'error', 'message' => 'Erreur lors du partage du post : ' . $conn->error]);
            }
        } else {
            http_response_code(401); // Unauthorized
            echo json_encode(['status' => 'error', 'message' => 'Utilisateur non connecté']);
        }
    } else {
        http_response_code(400); // Bad Request
        echo json_encode(['status' => 'error', 'message' => 'Données invalides ou texte manquant']);
    }
} else {
    http_response_code(405); // Method Not Allowed
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
