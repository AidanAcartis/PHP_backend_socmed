<?php
// upload.php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définir le type de contenu en JSON

error_reporting(E_ALL);
ini_set('display_errors', 1);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once '../config/config.php';

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

function handleFileUpload($file, $userId, $conn) {
    $targetDir = '/var/www/site1/Devoi_socila_media/public/documents/';
    
    // Déterminer le type de document
    if (strpos($file['type'], 'video/') === 0) {
        $targetDir .= 'videos/';
        $docType = 'video';
    } elseif (substr($file['type'], -3) === 'pdf') {
        $targetDir .= 'pdfs/';
        $docType = 'pdf';
    } else {
        $targetDir .= 'photos/';
        $docType = 'photo';
    }

    // Affichage pour le débogage
    // echo "Type de document détecté : " . $docType; // Pour le débogage

    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    $newFilePath = $targetDir . basename($file['name']);

    if (move_uploaded_file($file['tmp_name'], $newFilePath)) {
        chmod($newFilePath, 0777);
        $url = "http://localhost/Devoi_socila_media/public/documents/" . basename($targetDir) . "/" . basename($file['name']);

        // Préparer la requête pour insérer les données dans la base de données
        $query = 'INSERT INTO uploaded_documents (user_id, doc_type, doc_url) VALUES (?, ?, ?)';
        $stmt = $conn->prepare($query);
        if ($stmt === false) {
            return "Erreur de préparation de la requête : " . $conn->error;
        }
        $stmt->bind_param("iss", $userId, $docType, $url);
        if ($stmt->execute()) {
            $stmt->close();
            return "Fichier téléchargé et sauvegardé avec succès.";
        } else {
            $stmt->close();
            return "Erreur lors de l'insertion dans la base de données : " . $conn->error;
        }
    } else {
        return "Erreur lors du déplacement du fichier.";
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && isset($_POST['user_id'])) {
        ob_clean(); // Vider le tampon avant de renvoyer JSON
        $file = $_FILES['file'];
        $userId = intval($_POST['user_id']);
        
        $message = handleFileUpload($file, $userId, $conn);
        echo json_encode(["message" => $message]);
        exit();
    } else {
        ob_clean(); // Vider le tampon avant de renvoyer JSON
        echo json_encode(["message" => "Veuillez sélectionner un fichier et fournir un ID utilisateur."]);
        exit();
    }
}
