<?php
// Gestion des headers CORS et type de contenu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Démarrage de la session
session_start();

// Inclusion du fichier de configuration pour la base de données
include '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données']);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Récupération de l'ID du signalement depuis l'URL
$signalement_id = isset($_GET['id']) ? (int)$_GET['id'] : null;

// Vérification si l'ID est présent
if ($signalement_id === null) {
    echo json_encode(['status' => 'error', 'message' => 'ID du signalement manquant']);
    exit();
}

// Définir le chemin de base
$base_path = "/var/www/site1/Devoi_socila_media/src/backend/api/Proofs/proofs/";
$base_url = "http://localhost/Devoi_socila_media/src/backend/api/Proofs/proofs/";

// Validation de l'existence de fichiers téléchargés
if (!isset($_FILES['proofs'])) {
    echo json_encode(['status' => 'error', 'message' => 'Aucun fichier téléchargé']);
    exit();
}

$proofs = $_FILES['proofs'];

// Vérification des erreurs pour chaque fichier
if (empty($proofs['tmp_name']) || !is_array($proofs['tmp_name'])) {
    echo json_encode(['status' => 'error', 'message' => 'Aucun fichier valide détecté']);
    exit();
}

$uploaded_files = [];
foreach ($proofs['tmp_name'] as $index => $tmp_name) {
    if ($proofs['error'][$index] !== UPLOAD_ERR_OK) {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier', 'details' => $proofs['error'][$index]]);
        exit();
    }

    // Génération du chemin final et du nom de fichier
    $file_name = basename($proofs['name'][$index]);
    $file_path = $base_path . $file_name;
    $file_url = $base_url . $file_name;

    // Déplacement du fichier
    if (move_uploaded_file($tmp_name, $file_path)) {
        // Attribution des permissions 777
        if (!chmod($file_path, 0777)) {
            echo json_encode(['status' => 'error', 'message' => 'Impossible de définir les permissions sur le fichier téléchargé']);
            exit();
        }

        // Détection du type MIME
        $file_type = mime_content_type($file_path);

        // Insertion dans la base de données avec l'URL
        $query = "INSERT INTO preuves (signalement_id, file_path, file_type) VALUES (?, ?, ?)";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("iss", $signalement_id, $file_url, $file_type);

        if ($stmt->execute()) {
            $uploaded_files[] = [
                'file_path' => $file_url,
                'file_type' => $file_type,
                'created_at' => date('Y-m-d H:i:s')
            ];
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans la base de données']);
            exit();
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors du téléchargement du fichier']);
        exit();
    }
}

echo json_encode(['status' => 'success', 'uploaded_files' => $uploaded_files]);
?>
