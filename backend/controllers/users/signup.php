<?php
// Ajoutez les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON


session_start(); // Démarre la session
include_once '../../config/config.php';

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit;
}

// Récupérer les données de la requête
$data = json_decode(file_get_contents('php://input'), true);
$username = $data['username'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;

// Préparer la réponse JSON
header('Content-Type: application/json');

if (empty($username) || empty($email) || empty($password)) {
    echo json_encode(['error' => 'Nom d\'utilisateur, email ou mot de passe manquant.']);
    exit;
}

// Vérifier si l'utilisateur existe déjà par email
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si l'utilisateur existe déjà
    echo json_encode(['error' => 'L\'email est déjà utilisé. Veuillez vous connecter.']);
} else {
    // Hacher le mot de passe
    $hashed_password = password_hash($password, PASSWORD_DEFAULT);
    
    // Insérer l'utilisateur dans la base de données
    $insert_query = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
    $insert_stmt = $conn->prepare($insert_query);
    $insert_stmt->bind_param("sss", $username, $email, $hashed_password);

    if ($insert_stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Inscription réussie.']);
    } else {
        echo json_encode(['error' => 'Erreur lors de l\'inscription.']);
    }

    $insert_stmt->close();
}

$stmt->close();
$conn->close();
?>
