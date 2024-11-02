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
function handleFileUpload($file, &$docType, &$docUrl) {
    $targetDir = '/var/www/site1/Devoi_socila_media/public/documents/';
    $docType = null;
    $docUrl = null;

    // Vérifier si un fichier a été reçu
    if ($file && $file['error'] === UPLOAD_ERR_OK) {
        // Déterminer le type de fichier
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
        
        // Déplacer le fichier téléchargé
        if (move_uploaded_file($file['tmp_name'], $newFilePath)) {
            // Construire l'URL
            $baseUrl = 'http://localhost/Devoi_socila_media/public/documents/';
            $docUrl = $baseUrl . ($docType === 'photo' ? 'photos/' : ($docType === 'video' ? 'videos/' : 'pdfs/')) . basename($file['name']);
            return ['status' => 'success', 'message' => 'Fichier téléchargé avec succès.'];
        } else {
            return ['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier.'];
        }
    }
    // Si aucun fichier n'est reçu, considérer docType et docUrl comme NULL
    return ['status' => 'success', 'message' => 'Aucun fichier téléchargé, doc_type et doc_url définis à NULL.'];
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

function updateUserFileJson($conn) {
    // Vider le fichier userFile.json avant d'ajouter de nouvelles données
    file_put_contents('./userFile.json', json_encode([])); // Créer un fichier vide

    // Récupérer les données de uploaded_documents
    $result = $conn->query("SELECT * FROM uploaded_documents");
    $documents = [];

    if ($result) {
        while ($row = $result->fetch_assoc()) {
            $documents[] = $row;
        }
        // Écrire les nouvelles données dans le fichier JSON
        file_put_contents('./userFile.json', json_encode($documents, JSON_PRETTY_PRINT));
    }
}

// Vérifier que la requête est POST avant de traiter les données
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données envoyées
    $userId = $_POST['user_id'] ?? null;
    $content = $_POST['content'] ?? null;
    $file = $_FILES['file'] ?? null;

    // Initialiser docType et docUrl comme null
    $docType = null;
    $docUrl = null;

    // Vérifier les données et gérer le fichier
    if ($userId && $content) {
        ob_clean(); // Nettoyer le tampon de sortie
        $result = handleFileUpload($file, $docType, $docUrl);
        
        // Enregistrer le post dans la base de données
        $stmt = $conn->prepare("INSERT INTO posts (user_id, content, doc_type, doc_url) VALUES (?, ?, ?, ?)");
        $stmt->bind_param("isss", $userId, $content, $docType, $docUrl);
        
        if ($stmt->execute()) {
            // Insérer dans uploaded_documents si doc_type et doc_url ne sont pas NULL
            if ($docType && $docUrl) {
                $stmtUpload = $conn->prepare("INSERT INTO uploaded_documents (user_id, doc_type, doc_url) VALUES (?, ?, ?)");
                $stmtUpload->bind_param("iss", $userId, $docType, $docUrl);

                if (!$stmtUpload->execute()) {
                    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans uploaded_documents : ' . $stmtUpload->error]);
                }
            }
            // Mettre à jour le fichier JSON après une insertion réussie
            updateJsonFile($conn);
            updateUserFileJson($conn);
            echo json_encode(['status' => 'success', 'message' => 'Post ajouté avec succès.', 'fileMessage' => $result['message']]);
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans la base de données : ' . $stmt->error]);
        }
    } else {
        ob_clean(); // Nettoyer le tampon de sortie
        echo json_encode(['status' => 'error', 'message' => 'Données manquantes pour l\'utilisateur ou le contenu.']);
    }
} else {
    // Si la requête n'est pas POST, afficher un message d'information
    ob_clean(); // Nettoyer le tampon de sortie
    echo json_encode(['status' => 'error', 'message' => 'Veuillez envoyer une requête POST.']);
}

// Fermer la connexion à la base de données
$conn->close();
?>
