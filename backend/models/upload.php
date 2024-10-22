<?php
// upload.php
// Add the CORS headers
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header('Content-Type: application/json'); // Set content type to JSON

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Handle preflight request (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // Respond with the appropriate headers and exit
    http_response_code(200);
    exit();
}

require_once '../config/config.php'; // Include the database configuration

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Function to handle the file upload and insertion into the database
function handleFileUpload($file, $userId, $conn) {
    // Determine the file type and target directory
    $targetDir = '/var/www/site1/Devoi_socila_media/public/documents/';
    if (strpos($file['type'], 'video/') === 0) {
        $targetDir .= 'videos/';
        $docType = 'video';
    } elseif (substr($file['type'], -3) === 'pdf') {
        $targetDir .= 'pdfs/';
        $docType = 'pdf';
    } else {
        $targetDir .= 'photos/';
        $docType = 'photo';
    }

    // Create the target directory if it doesn't exist
    if (!is_dir($targetDir)) {
        mkdir($targetDir, 0777, true);
    }

    // Set the new file path
    $newFilePath = $targetDir . basename($file['name']);

    // Move the uploaded file
    if (move_uploaded_file($file['tmp_name'], $newFilePath)) {
        // Change the permissions of the uploaded file to 777
        chmod($newFilePath, 0777);
        // Construct the URL for the database
        $url = "http://localhost/Devoi_socila_media/public/documents/" . basename($targetDir) . "/" . basename($file['name']);

        // Insert the file information into the database
        $query = 'INSERT INTO uploaded_documents (user_id, doc_type, doc_url) VALUES (?, ?, ?)';
        $stmt = $conn->prepare($query);
        if ($stmt === false) {
            return "Erreur de préparation de la requête : " . $conn->error;
        }
        $stmt->bind_param("iss", $userId, $docType, $url);
        if ($stmt->execute()) {
            $stmt->close();
            return "File successfully uploaded and saved.";
        } else {
            $stmt->close();
            return "Erreur lors de l'insertion dans la base de données : " . $conn->error;
        }
    } else {
        return "Error while moving the file.";
    }
}

// Main logic for handling the file upload
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_FILES['file']) && isset($_POST['user_id'])) {
        $file = $_FILES['file'];
        $userId = intval($_POST['user_id']);
        
        $message = handleFileUpload($file, $userId, $conn);
        echo json_encode(["message" => $message]);
    } else {
        echo json_encode(["message" => "Please select a file and provide a user ID."]);
    }
}
