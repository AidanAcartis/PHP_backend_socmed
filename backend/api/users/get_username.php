<?php
// Connexion à la base de données
$host = "localhost";
$user = "jennie";
$password = "Str0ng!P@ssw0rd2024";
$dbname = "social_media_db";

$conn = new mysqli($host, $user, $password, $dbname);

if ($conn->connect_error) {
    die("Erreur de connexion: " . $conn->connect_error);
}

// Fonction pour récupérer l'username basé sur l'email
function getUsernameByEmail($email, $conn) {
    $stmt = $conn->prepare("SELECT username FROM users WHERE email = ?");
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $stmt->bind_result($username);
    $stmt->fetch();
    $stmt->close();

    return $username ? $username : null;
}

// Fermer la connexion après utilisation
//$conn->close();
?>