<?php
// Headers pour permettre les requêtes CORS (pour le frontend JS)
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Gérer les pré-requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Vérification de la méthode HTTP
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Récupérer les données JSON envoyées
    $data = json_decode(file_get_contents("php://input"), true);

    if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(['status' => 'error', 'message' => 'ID non fourni.']);
        exit();
    }
    $proofId = $conn->real_escape_string($data['id']);

    try {
        // Démarrer une transaction
        $conn->begin_transaction();

        // Étape 1 : Récupérer les IDs des preuves liées au signalement
$query = "SELECT id, file_path FROM preuves WHERE signalement_id = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $signalementId);
$stmt->execute();
$result = $stmt->get_result();

$proofIds = [];
while ($row = $result->fetch_assoc()) {
    $proofIds[] = $row['id'];
    $filePaths[] = $row['file_path']; // Ajouter le chemin du fichier pour chaque preuve
}
$stmt->close();

// Étape 2 : Supprimer les fichiers des preuves (optionnel, selon votre logique)
if (!empty($filePaths)) {
    foreach ($filePaths as $filePath) {
        // Convertir le chemin du fichier HTTP en chemin local sur le serveur
        $localFilePath = str_replace("http://localhost/Devoi_socila_media", "/var/www/site1/Devoi_socila_media", $filePath);

        // Vérifier si le fichier existe et le supprimer
        if (file_exists($localFilePath)) {
            unlink($localFilePath); // Supprimer le fichier physique
        }
    }
}

// Étape 3 : Supprimer les preuves de la base de données
if (!empty($proofIds)) {
    $placeholders = implode(',', array_fill(0, count($proofIds), '?'));
    $query = "DELETE FROM preuves WHERE id IN ($placeholders)";
    $stmt = $conn->prepare($query);
    $stmt->bind_param(str_repeat('i', count($proofIds)), ...$proofIds);
    $stmt->execute();
    $stmt->close();
}

    
        // Étape 1 : Supprimer le fichier physique si nécessaire (optionnel selon votre logique)
        $querySelect = "SELECT file_path FROM preuves WHERE id = ?";
        $stmtSelect = $conn->prepare($querySelect);
        $stmtSelect->bind_param("i", $proofId);
        $stmtSelect->execute();
        $result = $stmtSelect->get_result();
    
        if ($result->num_rows > 0) {
            $proof = $result->fetch_assoc();
            $filePath = $proof['file_path'];
    
            // Supprimer le fichier physique si le chemin existe
            $localFilePath = str_replace("http://localhost/Devoi_socila_media", "/var/www/site1/Devoi_socila_media", $filePath);
            if (file_exists($localFilePath)) {
                unlink($localFilePath); // Supprimer le fichier
            }
        }
    
        $stmtSelect->close();
    
        // Étape 2 : Supprimer la preuve de la base de données
        $queryDelete = "DELETE FROM preuves WHERE id = ?";
        $stmtDelete = $conn->prepare($queryDelete);
        $stmtDelete->bind_param("i", $proofId);
        $stmtDelete->execute();
        $stmtDelete->close();
    
        // Valider la transaction
        $conn->commit();
    
        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Preuve supprimée avec succès.']);
    } catch (Exception $e) {
        // Annuler la transaction en cas d'erreur
        $conn->rollback();
        http_response_code(500);
        echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la suppression : ' . $e->getMessage()]);
    }
    } else {
        http_response_code(405);
        echo json_encode(['status' => 'error', 'message' => 'Méthode HTTP non autorisée.']);
    }
    
$conn->close();
?>
