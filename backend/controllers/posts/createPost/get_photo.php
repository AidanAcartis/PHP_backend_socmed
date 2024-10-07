<?php
// Ajoutez les en-têtes CORS pour autoriser les requêtes depuis votre frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON

// Vérifiez si la requête est de type OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Démarrage de la session
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclusion du fichier de configuration pour la connexion à la base de données
include_once '../../../config/config.php'; // Assurez-vous que le chemin est correct

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Récupérer le lien de la photo (par exemple, passé via POST)
$data = json_decode(file_get_contents("php://input"), true); // Décoder le JSON reçu
$photoUrl = $data['photo_url']; // Récupérer le lien de la photo

// Récupérer l'ID du dernier post
$result = $conn->query("SELECT id FROM posts ORDER BY id DESC LIMIT 1");
if ($result && $result->num_rows > 0) {
    $lastPost = $result->fetch_assoc();
    $lastPostId = $lastPost['id']; // ID du dernier post
} else {
    http_response_code(404);
    echo json_encode(['status' => 'error', 'message' => 'Aucun post trouvé.']);
    exit();
}

// Préparer l'insertion avec l'ID du dernier post
$stmt = $conn->prepare("UPDATE posts SET photos = ? WHERE id = ?");
$stmt->bind_param("si", $photoUrl, $lastPostId);

// Exécuter la requête
if ($stmt->execute()) {
    echo json_encode(['status' => 'success', 'message' => 'Photo insérée avec succès.']);
    // Appeler get_post.php pour mettre à jour post.json
    include './updatePosts.php'; // Inclure get_post.php ici
} else {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion de la photo : ' . $stmt->error]);
}

// Fermer la connexion
$stmt->close();
$conn->close();
?>
