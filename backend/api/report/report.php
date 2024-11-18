<?php
// create_post.php

// Set the necessary headers for CORS and content type
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json');

// Start the session and set error reporting
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database configuration file
include('../../config/config.php');

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Respond to OPTIONS requests (CORS pre-flight request)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Récupérer les données envoyées par le formulaire
$full_name = $_POST['full_name'] ?? '';
$date = $_POST['date'] ?? '';  // Récupération de la date
$hour = $_POST['hour'] ?? '';
$location = $_POST['location'] ?? '';
$description = $_POST['description'] ?? '';
$user_id = $_POST['user_id'] ?? '';
$receiver_id = $_POST['receiver_id'] ?? '';

// Validation et formatage de la date
if (empty($date)) {
    echo json_encode(['status' => 'error', 'message' => 'La date est obligatoire']);
    exit();
} else {
    // Vérifier que la date est dans un format valide (YYYY-MM-DD)
    $date_format = 'Y-m-d';
    $d = DateTime::createFromFormat($date_format, $date);
    if (!$d || $d->format($date_format) !== $date) {
        echo json_encode(['status' => 'error', 'message' => 'La date est invalide']);
        exit();
    }
}

// Vérifier si un fichier signature est envoyé
if (isset($_FILES['signature']) && $_FILES['signature']['error'] == 0) {
    $signature = $_FILES['signature'];
    $signature_name = $signature['name'];
    $signature_tmp_name = $signature['tmp_name'];
    $signature_size = $signature['size'];
    $signature_ext = pathinfo($signature_name, PATHINFO_EXTENSION);

    // Définir un dossier de destination pour la signature
    $upload_dir = '../uploads/signatures/';
    $signature_path = $upload_dir . uniqid() . '.' . $signature_ext;

    // Déplacer le fichier signature dans le dossier de destination
    move_uploaded_file($signature_tmp_name, $signature_path);

    $signature_path = (strpos($signature_path, '../') === 0) ? substr($signature_path, 3) : $signature_path;
    $signature_url = "http://localhost/Devoi_socila_media/src/backend/api/" . $signature_path;
} else {
    $signature_url = null;
}

// Vérifier si un fichier est envoyé
if (isset($_FILES['file']) && $_FILES['file']['error'] == 0) {
    $file = $_FILES['file'];
    $file_name = $file['name'];
    $file_tmp_name = $file['tmp_name'];
    $file_size = $file['size'];
    $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);

    // Définir un dossier de destination pour les fichiers
    $upload_dir = '../uploads/files/';
    $file_path = $upload_dir . uniqid() . '.' . $file_ext;

    // Déplacer le fichier dans le dossier de destination
    move_uploaded_file($file_tmp_name, $file_path);

    // Convertir en URL complète (en enlevant '../' avant de construire l'URL)
    // Vérification si le chemin commence par '../'
    $file_path = (strpos($file_path, '../') === 0) ? substr($file_path, 3) : $file_path;
    $file_url = "http://localhost/Devoi_socila_media/src/backend/api/" . $file_path;
} else {
    $file_url = null;
}

// Préparer la requête d'insertion dans la base de données
$query = "INSERT INTO signalements (full_name, date, hour, location, description, user_id, receiver_id, signature_path, file_path) 
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

// Préparer la requête SQL
$stmt = $conn->prepare($query);

// Lier les paramètres
$stmt->bind_param("sssssssss", $full_name, $date, $hour, $location, $description, $user_id, $receiver_id, $signature_url, $file_url);

// Exécuter la requête
if ($stmt->execute()) {
     // Récupération de l'ID de l'utilisateur inséré
     $actor_id = $user_id;
     $cible_id = $receiver_id;

     // Insertion dans la table 'notifications'
     $sql_notification = "INSERT INTO notifications (actor_id, user_id, type) VALUES (?, ?, 'signalement')";
     $stmt_notification = $conn->prepare($sql_notification);
     $stmt_notification->bind_param("ii", $actor_id, $cible_id);
 
     if ($stmt_notification->execute()) {
         echo json_encode(['status' => 'success', 'message' => 'Signalement et notification ajoutés avec succès']);
     } else {
         echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'insertion dans la table notifications : ' . $stmt_notification->error]);
     }
} else {
    // Retourner une réponse JSON en cas d'échec
    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la création du signalement']);
}
?>
