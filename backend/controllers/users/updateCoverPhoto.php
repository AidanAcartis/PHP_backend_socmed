<?php
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

session_start();

include '../../config/config.php'; // Connexion à la base de données

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit();
}

// Vérifiez si la requête est de type POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérification de la connexion de l'utilisateur
    if (isset($_SESSION['user_logged_in']) && $_SESSION['user_logged_in'] === true) {
        $userId = $_SESSION['user_id'];

        // Vérification de la présence du fichier et de son téléchargement
        if (isset($_FILES['cover_photo']) && $_FILES['cover_photo']['error'] === UPLOAD_ERR_OK) {
            $file = $_FILES['cover_photo'];
            $uploadDir = '../../uploads/cover_photos/';
            $baseURL = 'http://localhost/Devoi_socila_media/src/backend/uploads/cover_photos/';

            // Vérifier et créer le répertoire d'uploads si nécessaire
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0777, true);
            }

            // Définir le chemin du fichier
            $fileName = uniqid() . "_" . basename($file['name']);
            $targetPath = $uploadDir . $fileName;
            $photoURL = $baseURL . $fileName; // URL complète de la photo

            // Déplacer le fichier vers le répertoire d'uploads
            if (move_uploaded_file($file['tmp_name'], $targetPath)) {
                // Vérifiez si l'utilisateur a déjà une photo de couverture
                $checkStmt = $conn->prepare("SELECT * FROM cover_photo WHERE user_id = ?");
                $checkStmt->bind_param("i", $userId);
                $checkStmt->execute();
                $result = $checkStmt->get_result();

                if ($result->num_rows > 0) {
                    // Si l'utilisateur a déjà une photo, mettez à jour
                    $stmt = $conn->prepare("
                        UPDATE cover_photo 
                        SET photo_path = ?, uploaded_at = CURRENT_TIMESTAMP 
                        WHERE user_id = ?
                    ");
                    $stmt->bind_param("si", $photoURL, $userId); // Utiliser l'URL complète
                } else {
                    // Si l'utilisateur n'a pas de photo, insérez une nouvelle entrée
                    $stmt = $conn->prepare("
                        INSERT INTO cover_photo (user_id, photo_path, uploaded_at)
                        VALUES (?, ?, CURRENT_TIMESTAMP)
                    ");
                    $stmt->bind_param("is", $userId, $photoURL); // Utiliser l'URL complète
                }

                // Exécutez la requête d'insertion ou de mise à jour
                if ($stmt->execute()) {
                    echo json_encode(['status' => 'success', 'message' => 'Photo de couverture mise à jour avec succès']);
                } else {
                    http_response_code(500);
                    echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la mise à jour de la photo de couverture : ' . $stmt->error]);
                }

                // Fermez les déclarations
                $stmt->close();
                $checkStmt->close();
            } else {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur lors du téléchargement de la photo']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Photo de couverture manquante ou téléchargement échoué']);
        }

        // Récupération des données de la table 'cover_photo' et écriture dans 'cover_photo.json'
        $data = [];
        $result = $conn->query("SELECT photo_id, user_id, photo_path, uploaded_at FROM cover_photo");

        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }

            // Écriture des données dans 'cover_photo.json'
            $json_data = json_encode($data, JSON_PRETTY_PRINT);

            if (file_put_contents('./cover_photo.json', $json_data) === false) {
                http_response_code(500);
                echo json_encode(['status' => 'error', 'message' => 'Erreur lors de l\'écriture du fichier JSON']);
            }
        } else {
            http_response_code(500);
            echo json_encode(['status' => 'error', 'message' => 'Erreur lors de la récupération des données de la base']);
        }
    } else {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'Utilisateur non authentifié']);
    }
} else {
    http_response_code(405);
    echo json_encode(['status' => 'error', 'message' => 'Méthode non autorisée']);
}

// Fermeture de la connexion à la base de données
$conn->close();
?>
