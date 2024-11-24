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

    $signalementId = $conn->real_escape_string($data['id']);

    try {
        // Démarrer une transaction
        $conn->begin_transaction();

        // Étape 1 : Récupérer les IDs des `security_complaints`
        $query = "SELECT id FROM security_complaints WHERE signalement_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $signalementId);
        $stmt->execute();
        $result = $stmt->get_result();

        $securityComplaintIds = [];
        while ($row = $result->fetch_assoc()) {
            $securityComplaintIds[] = $row['id'];
        }
        $stmt->close();

        // Étape 2 : Supprimer dans `status_history` pour les `security_complaint_id`
        if (!empty($securityComplaintIds)) {
            $placeholders = implode(',', array_fill(0, count($securityComplaintIds), '?'));
            $query = "DELETE FROM status_history WHERE security_complaint_id IN ($placeholders)";
            $stmt = $conn->prepare($query);
            $stmt->bind_param(str_repeat('i', count($securityComplaintIds)), ...$securityComplaintIds);
            $stmt->execute();
            $stmt->close();
        }

        // Étape 3 : Supprimer dans `security_complaints`
        $query = "DELETE FROM security_complaints WHERE signalement_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $signalementId);
        $stmt->execute();
        $stmt->close();

        // Étape 4 : Supprimer dans `evaluations`
        $query = "DELETE FROM evaluations WHERE signalement_id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $signalementId);
        $stmt->execute();
        $stmt->close();

        // Étape 5 : Supprimer dans `signalements` (table principale)
        $query = "DELETE FROM signalements WHERE id = ?";
        $stmt = $conn->prepare($query);
        $stmt->bind_param("i", $signalementId);
        $stmt->execute();
        $stmt->close();

        // Valider la transaction
        $conn->commit();

        http_response_code(200);
        echo json_encode(['status' => 'success', 'message' => 'Signalement supprimé avec succès.']);
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
