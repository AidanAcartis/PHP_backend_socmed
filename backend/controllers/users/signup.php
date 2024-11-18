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
$userType = $data['userType'] ?? null; // Ajouter le type d'utilisateur

// Préparer la réponse JSON
header('Content-Type: application/json');

if (empty($username) || empty($email) || empty($password) || empty($userType)) {
    echo json_encode(['error' => 'Nom d\'utilisateur, email, mot de passe ou type d\'utilisateur manquant.']);
    exit;
}

// Vérifier si l'utilisateur existe déjà par email
$query = "SELECT * FROM users WHERE email = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    // Si l'utilisateur existe déjà, renvoyer une erreur
    echo json_encode(['error' => 'Un utilisateur avec cet email existe déjà.']);
    exit;
}

// Hacher le mot de passe
$hashedPassword = password_hash($password, PASSWORD_BCRYPT);


// Insérer les données dans la table appropriée en fonction de userType
if ($userType === 'utilisateur') {
    $query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'utilisateur')";
} elseif ($userType === 'securite') {
    $query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'securite')";
} elseif ($userType === 'sante') {
    $query = "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, 'sante')";
} else {
    echo json_encode(['error' => 'Type d\'utilisateur invalide.']);
    exit;
}

// Préparer la requête d'insertion
$stmt = $conn->prepare($query);
$stmt->bind_param("sss", $username, $email, $hashedPassword);


if ($stmt->execute()) {
    echo json_encode(['success' => 'Utilisateur enregistré avec succès.']);
} else {
    echo json_encode(['error' => 'Erreur lors de l\'enregistrement de l\'utilisateur.']);
}

$stmt->close();
$conn->close();
