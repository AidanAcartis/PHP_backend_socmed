<?php
// Ajoutez les en-têtes CORS
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Définit le type de contenu à JSON

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Inclusion du fichier de configuration pour la connexion à la base de données
include_once '../../config/config.php';

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    die(json_encode(['error' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]));
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    exit; 
}

$data = json_decode(file_get_contents('php://input'), true);
$email = $data['email'] ?? null; 
$password = $data['password'] ?? null; 

// Récupérer tous les utilisateurs
$query = "SELECT id, email, password, username FROM users";
$result = $conn->query($query);

// Vérifiez si la requête a réussi
if (!$result) {
    echo json_encode(['error' => 'Erreur de requête : ' . $conn->error]);
    exit; // Sortie si la requête échoue
}

$user_found = false;

while ($row = $result->fetch_assoc()) {
    // Comparaison de l'email
    if ($row['email'] == $email) {
        $user_found = true;
        // Vérifier si le mot de passe est correct
        if (password_verify($password, $row['password'])) {
            session_start();
            $_SESSION['user_logged_in'] = true;
            $_SESSION['user_id'] = $row['id'];
            $userId = $_SESSION['user_id'];
            file_put_contents('./userId.txt', $userId);
            
            // Créer un cookie d'authentification
            $authToken = bin2hex(random_bytes(16)); // Générer un token aléatoire
            setcookie('authToken', $authToken, [
                'expires' => time() + 86400, // 1 jour
                'path' => '/',
                'httponly' => true, // Protection contre l'accès JavaScript
                'secure' => false, // Nécessite HTTPS
                'samesite' => 'Strict' // Limite l'envoi du cookie à des requêtes du même site
            ]);

            // Réponse avec l'username
            $monfihcier = fopen('./fichier.txt', 'r+');
            $name = $row['username'];
            fputs($monfihcier, $name);
            fclose($monfihcier);
            // Forcer la fermeture de la session
            session_write_close();
            echo json_encode(['success' => true, 'message' => 'connexion réussie', 'username' => $row['username']]);
            exit; // Sortie après succès
        } else {
            echo json_encode(['error' => 'Mot de passe incorrect']);
            exit; // Sortie si le mot de passe est incorrect
        }
    }
}

if (!$user_found) {
    http_response_code(404); // Définir le code de réponse HTTP à 404
    echo json_encode(['error' => 'Utilisateur non trouvé. Vous devez vous inscrire.']);
    exit; // S'assurer que le script s'arrête ici
}

$result->free();
$conn->close();
?>
