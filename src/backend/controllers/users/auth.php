<?php
// Ajoutez les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON


session_start(); // Démarre la session si ce n'est pas déjà fait

// Fonction pour vérifier si un utilisateur est connecté
function isLoggedIn() {
    return isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true;
}

// Vérifiez si le cookie d'authentification est présent
function checkAuthToken($conn) {
    if (isset($_COOKIE['authToken'])) {
        $token = $_COOKIE['authToken'];
        
        // Vérifiez la validité du token dans la base de données
        $stmt = $conn->prepare("SELECT user_id FROM auth_tokens WHERE token = ?");
        $stmt->bind_param("s", $token);
        $stmt->execute();
        $stmt->store_result();

        if ($stmt->num_rows > 0) {
            $stmt->bind_result($user_id);
            $stmt->fetch();
            $_SESSION['user_id'] = $user_id; // Stocker l'ID de l'utilisateur dans la session
            $_SESSION['user_logged_in'] = true; // Marquer l'utilisateur comme connecté
            return true; // Token valide
        }
    }
    return false; // Token non valide
}

// Fonction pour se déconnecter
function logout() {
    session_unset(); // Efface toutes les variables de session
    session_destroy(); // Détruit la session
    setcookie('authToken', '', time() - 3600, '/'); // Supprime le cookie d'authentification
    header("Location: login.php"); // Redirige vers la page de connexion
    exit;
}

// Optionnel : Fonction pour obtenir l'ID de l'utilisateur connecté
function getUserId() {
    return $_SESSION['user_id'] ?? null; // Renvoie l'ID de l'utilisateur ou null
}

// Exemple d'utilisation des fonctions ci-dessus
include_once '../../config/config.php'; // Incluez votre fichier de configuration pour la base de données

if (!isLoggedIn() && !checkAuthToken($conn)) {
    // Rediriger vers la page de connexion si l'utilisateur n'est pas connecté
    header("Location: login.php");
    exit;
}
?>
