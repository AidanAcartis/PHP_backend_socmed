<?php
// create_post.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

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

// Fonction pour gérer le téléchargement de fichiers
function handleFileUpload($file, $userId, $content, $conn) {
    $targetDir = '/var/www/site1/Devoi_socila_media/public/documents/';

    // Vérifier le type de fichier
    $docType = '';
    if (strpos($file['type'], 'video/') === 0) {
        $targetDir .= 'videos/';
        $docType = 'video';
    } elseif ($file['type'] === 'application/pdf') {
        $targetDir .= 'pdfs/';
        $docType = 'pdf';
    } elseif (strpos($file['type'], 'image/') === 0) {
        $targetDir .= 'photos/';
        $docType = 'photo';
    } else {
        return ['status' => 'error', 'message' => 'Type de fichier non supporté.'];
    }

    // Créer le répertoire si nécessaire
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $newFilePath = $targetDir . basename($file['name']);
    
    // Vérification de l'upload
    if (move_uploaded_file($file['tmp_name'], $newFilePath)) {
        // Construire l'URL correcte
        $baseUrl = 'http://localhost/Devoi_socila_media/public/documents/';
        $docUrl = $baseUrl . ($docType === 'photo' ? 'photos/' : ($docType === 'video' ? 'videos/' : 'pdfs/')) . basename($file['name']);
        
        // Enregistrer le chemin dans la base de données
        $stmt = $conn->prepare("INSERT INTO posts (user_id, content, doc_type, doc_url) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $userId, $content, $docType, $docUrl);
        
        if ($stmt->execute()) {
            // Mettre à jour le fichier JSON après une insertion réussie
            updateJsonFile($conn);
            return ['status' => 'success', 'message' => 'Fichier téléchargé avec succès.'];
        } else {
            return ['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans la base de données : ' . $stmt->error];
        }
    } else {
        return ['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier.'];
    }
}

// Fonction pour mettre à jour le fichier JSON
function updateJsonFile($conn) {
    $result = $conn->query("SELECT * FROM posts");
    $posts = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $posts[] = $row;
        }
        // Écrire les données dans le fichier JSON
        file_put_contents('./posts.json', json_encode($posts, JSON_PRETTY_PRINT));
    }
}

// Vérifier que la requête est POST avant de traiter les données
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données envoyées
    $userId = $_POST['user_id'] ?? null;
    $content = $_POST['content'] ?? null;
    $file = $_FILES['file'] ?? null;

    // Vérification des données reçues
    if ($userId && $content && $file && $file['error'] === UPLOAD_ERR_OK) {
        ob_clean(); // Nettoyer le tampon de sortie
        $result = handleFileUpload($file, $userId, $content, $conn);
        echo json_encode($result);
    } else {
        ob_clean(); // Nettoyer le tampon de sortie
        echo json_encode(['status' => 'error', 'message' => 'Données manquantes ou erreur dans le fichier.']);
    }
} else {
    // Si la requête n'est pas POST, afficher un message d'information
    ob_clean(); // Nettoyer le tampon de sortie
    echo json_encode(['status' => 'error', 'message' => 'Veuillez envoyer une requête POST.']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
