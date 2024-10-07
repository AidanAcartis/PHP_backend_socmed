<?php
// Ajoutez les en-têtes CORS pour autoriser les requêtes depuis votre frontend
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON

// Inclusion du fichier de configuration pour la connexion à la base de données
include_once '../../../config/config.php';

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

// Exécuter la requête SQL pour récupérer tous les posts
$sql = "SELECT id, content, user_id, created_at, photo FROM posts";
$result = $conn->query($sql);

// Vérifier si des posts ont été trouvés
if ($result->num_rows > 0) {
    // Créer un tableau pour stocker tous les posts
    $postsArray = [];
    
    // Parcourir les résultats et les ajouter au tableau
    while ($row = $result->fetch_assoc()) {
        $postsArray[] = [
            'id' => $row['id'],
            'content' => $row['content'],
            'user_id' => $row['user_id'],
            'created_at' => $row['created_at'],
            'photo' => $row['photo']
        ];
    }

    // Sauvegarder tous les posts dans un fichier JSON
    file_put_contents('./posts.json', json_encode($postsArray));

    // Répondre avec tous les posts
    http_response_code(200); // OK
    echo json_encode(['status' => 'success', 'data' => $postsArray]);
} else {
    // Aucun post trouvé
    http_response_code(404); // Not Found
    echo json_encode(['status' => 'error', 'message' => 'Aucun post trouvé']);
}

// Fermer la connexion à la base de données

?>
