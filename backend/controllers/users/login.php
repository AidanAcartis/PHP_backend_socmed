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
$userType = $data['userType'] ?? null; // Récupérer le type d'utilisateur

// Sélectionner la table en fonction du userType
if ($userType == 'utilisateur') {
    $query = "SELECT id, email, password, username FROM users WHERE email = ?";
} elseif ($userType == 'securite' || $userType == 'sante') {
    $query = "SELECT id, email, password, username FROM users WHERE email = ?";
} else {
    echo json_encode(['error' => 'Type d\'utilisateur inconnu']);
    exit;
}

// Préparer la requête SQL
$stmt = $conn->prepare($query);

// Vérifier si la préparation a réussi
if ($stmt === false) {
    echo json_encode(['error' => 'Erreur de préparation de la requête : ' . $conn->error]);
    exit;
}

// Lier les paramètres
$stmt->bind_param('s', $email);  // 's' indique que le paramètre est une chaîne de caractères

// Exécuter la requête
$stmt->execute();

// Récupérer le résultat de la requête
$result = $stmt->get_result();

// Vérifiez si la requête a retourné des résultats
if ($result->num_rows > 0) {
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
                var_dump($userType);
                file_put_contents('./userType.txt', $userType);

                if (file_put_contents('./userType.txt', $userType) === false) {
                    echo json_encode(['error' => 'Erreur d\'écriture dans le fichier userType.txt']);
                    exit;
                }            

                // Créer un cookie d'authentification
                $authToken = bin2hex(random_bytes(16)); // Générer un token aléatoire
                setcookie('authToken', $authToken, [
                    'expires' => time() + 86400, // 1 jour
                    'path' => '/',
                    'httponly' => true, // Protection contre l'accès JavaScript
                    'secure' => false, // Nécessite HTTPS
                    'samesite' => 'Strict' // Limite l'envoi du cookie à des requêtes du même site
                ]);

                $name = $row['username'];
                file_put_contents('./fichier.txt', $name);
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

} else {
    echo json_encode(['error' => 'Erreur de requête : ' . $conn->error]);
    exit;
}

// Libérer les ressources et fermer la connexion
$stmt->free_result();
$stmt->close();
$conn->close();
?>
