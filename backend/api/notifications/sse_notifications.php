<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

session_start();
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

include '../../config/config.php'; // Connexion à la base de données

// Vérifier la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo "data: Erreur de connexion à la base de données\n\n";
    flush();
    exit();
}

// Vérifier que l'utilisateur est connecté et récupérer son ID
if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
    $userId = $_SESSION['user_id'];

    // Compter le nombre de lignes dans la table des notifications pour l'utilisateur
    $stmt = $conn->prepare("SELECT COUNT(*) as total_count FROM notifications WHERE user_id = ?");
    $stmt->bind_param("i", $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    $totalCount = $row['total_count'];
    $stmt->close();

    // Définir la durée maximale de la boucle (ex. 1 minute)
    $startTime = time();
    $maxDuration = 60; // Durée en secondes

    for ($i = 0; $i < $totalCount && (time() - $startTime < $maxDuration); $i++) {
        // Tableau pour contenir les notifications non lues
        $unreadNotifications = [];

        // Récupérer les notifications par pagination (un par un)
        $stmt = $conn->prepare("SELECT id, actor_id, type, is_read, created_at FROM notifications WHERE user_id = ? LIMIT 1 OFFSET ?");
        $stmt->bind_param("ii", $userId, $i);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($notification = $result->fetch_assoc()) {
            if ($notification['is_read'] == 0) {
                $unreadNotifications[] = $notification;
            }
        }
        $stmt->close();

        // Si des notifications non lues existent, les envoyer au client
        if (!empty($unreadNotifications)) {
            $unreadJson = json_encode($unreadNotifications);
            echo "data: $unreadJson\n\n";
            flush();
        } else {
            echo "data: {\"message\": \"Aucune notification non lue\"}\n\n";
            flush();
        }
    }

    // Fin de la connexion SSE après la durée maximale
    echo "data: Fin de la vérification des notifications\n\n";
    flush();
    exit();
} else {
    echo "data: Utilisateur non authentifié\n\n";
    flush();
    exit();
}
?>
