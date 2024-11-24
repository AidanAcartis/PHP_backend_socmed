<?php
// Gestion des headers CORS et type de contenu
header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Credentials: true");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json; charset=UTF-8");

// Démarrage de la session
session_start();

// Activation des rapports d'erreurs pour le développement
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclusion du fichier de configuration pour la base de données
include '../../config/config.php'; // Modifiez le chemin si nécessaire

// Log de démarrage pour le débogage
error_log("Début de l'exécution du fichier signalement.php");

// Vérification de la connexion à la base de données
if ($conn->connect_error) {
    error_log("Erreur de connexion à la base de données : " . $conn->connect_error);
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'Erreur de connexion à la base de données : ' . $conn->connect_error]);
    exit();
}

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    error_log("Requête OPTIONS reçue");
    http_response_code(204); // Pas de contenu pour les OPTIONS
    exit();
}

// Récupérer les données envoyées par le formulaire
$data = json_decode(file_get_contents("php://input"), true);

// Vérification si les données sont présentes
if (empty($data['signalement_id']) || empty($data['responsible_service']) || empty($data['next_step']) || empty($data['current_status'])) {
    echo json_encode(["error" => "Certaines données sont manquantes."]);
    exit();
}

// Assurez-vous que signalement_id est un entier
$signalement_id = (int)$data['signalement_id'];
$responsible_service = $data['responsible_service'];
$next_step = $data['next_step'];
$next_date = $data['next_date'];
$current_status = $data['current_status'];
$service_comments = $data['service_comments'];
$priority = $data['priority'];

// Échapper les données pour éviter les problèmes de syntaxe SQL
$responsible_service = mysqli_real_escape_string($conn, $responsible_service);
$next_step = mysqli_real_escape_string($conn, $next_step);
$next_date = mysqli_real_escape_string($conn, $next_date);
$current_status = mysqli_real_escape_string($conn, $current_status);
$service_comments = mysqli_real_escape_string($conn, $service_comments);
$priority = mysqli_real_escape_string($conn, $priority);

// Vérification si le signalement_id existe déjà
$sql_check = "SELECT * FROM security_complaints WHERE signalement_id = '$signalement_id'";
$result = $conn->query($sql_check);

if ($result->num_rows > 0) {
    // Mise à jour si le signalement existe déjà
    $sql_update = "UPDATE security_complaints 
                   SET responsible_service = '$responsible_service',
                       next_step = '$next_step',
                       next_date = '$next_date',
                       current_status = '$current_status',
                       service_comments = '$service_comments',
                       priority = '$priority'
                   WHERE signalement_id = '$signalement_id'";

    if ($conn->query($sql_update) === TRUE) {
        // Récupérer le dernier statut et étape enregistrés
        $sql_select_previous = "SELECT new_status, new_step 
                                FROM status_history 
                                WHERE security_complaint_id = '$signalement_id' 
                                ORDER BY change_date DESC LIMIT 1";
        $result_previous = $conn->query($sql_select_previous);

        if ($result_previous->num_rows > 0) {
            $row_previous = $result_previous->fetch_assoc();
            $previous_status = $row_previous['new_status'];
            $previous_step = $row_previous['new_step'];
        } else {
            $previous_status = NULL;  // Aucun historique trouvé
            $previous_step = NULL;
        }

        // Insérer dans status_history
        $changed_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;

        $sql_history = "INSERT INTO status_history (security_complaint_id, previous_status, new_status, previous_step, new_step, changed_by, comments) 
                        VALUES ('$signalement_id', '$previous_status', '$current_status', '$previous_step', '$next_step', '$changed_by', '$service_comments')";
        
        //Inserer dans la notification ici
        if ($conn->query($sql_history) === TRUE) {
            // Récupérer l'ID de l'insertion dans la table status_history
            $last_history_id = $conn->insert_id;
        
            // Étape 1 : Récupérer actor_id depuis la session
            $actor_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;
        
            // Étape 2 : Récupérer user_id pour la notification
            // Trouver le security_complaint_id correspondant
            $sql_get_signalement_id = "
                SELECT sc.signalement_id, s.user_id
                FROM status_history sh
                JOIN security_complaints sc ON sh.security_complaint_id = sc.id
                JOIN signalements s ON sc.signalement_id = s.id
                WHERE sh.id = '$last_history_id'";
        
            $result = $conn->query($sql_get_signalement_id);
        
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $notification_user_id = $row['user_id'];
        
                // Étape 3 : Insérer la notification
                $sql_notification = "
                    INSERT INTO notifications (actor_id, user_id, type, is_read)
                    VALUES ('$actor_id', '$notification_user_id', 'new_status', 0)";
                
                if ($conn->query($sql_notification) === TRUE) {
                    echo json_encode(["message" => "Données mises à jour avec succès, notification créée"]);
                } else {
                    echo json_encode(["error" => "Erreur lors de l'insertion de la notification : " . $conn->error]);
                }
            } else {
                echo json_encode(["error" => "Impossible de récupérer user_id pour la notification"]);
            }
        } else {
            echo json_encode(["error" => "Erreur lors de l'insertion dans l'historique des statuts: " . $conn->error]);
        }
        

        if ($conn->query($sql_history) === TRUE) {
            echo json_encode(["message" => "Données mises à jour avec succès"]);
        } else {
            echo json_encode(["error" => "Erreur lors de l'insertion dans l'historique des statuts: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Erreur lors de la mise à jour des données: " . $conn->error]);
    }
} else {
    // Insérer un nouveau signalement
    $sql_insert = "INSERT INTO security_complaints (signalement_id, responsible_service, next_step, next_date, current_status, service_comments, priority) 
                   VALUES ('$signalement_id', '$responsible_service', '$next_step', '$next_date', '$current_status', '$service_comments', '$priority')";
    
   
    if ($conn->query($sql_insert) === TRUE) {
        $last_id = $conn->insert_id;

        // Insérer dans status_history
        $changed_by = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;

        $sql_history = "INSERT INTO status_history (security_complaint_id, previous_status, new_status, previous_step, new_step, changed_by, comments) 
                        VALUES ('$last_id', NULL, '$current_status', NULL, '$next_step', '$changed_by', '$service_comments')";
        
         //Inserer dans la notification
         if ($conn->query($sql_history) === TRUE) {
            // Récupérer l'ID de l'insertion dans la table status_history
            $last_history_id = $conn->insert_id;
        
            // Étape 1 : Récupérer actor_id depuis la session
            $actor_id = isset($_SESSION['user_id']) ? $_SESSION['user_id'] : NULL;
        
            // Étape 2 : Récupérer user_id pour la notification
            // Trouver le security_complaint_id correspondant
            $sql_get_signalement_id = "
                SELECT sc.signalement_id, s.user_id
                FROM status_history sh
                JOIN security_complaints sc ON sh.security_complaint_id = sc.id
                JOIN signalements s ON sc.signalement_id = s.id
                WHERE sh.id = '$last_history_id'";
        
            $result = $conn->query($sql_get_signalement_id);
        
            if ($result->num_rows > 0) {
                $row = $result->fetch_assoc();
                $notification_user_id = $row['user_id'];
        
                // Étape 3 : Insérer la notification
                $sql_notification = "
                    INSERT INTO notifications (actor_id, user_id, type, is_read)
                    VALUES ('$actor_id', '$notification_user_id', 'new_status', 0)";
                
                if ($conn->query($sql_notification) === TRUE) {
                    echo json_encode(["message" => "Données mises à jour avec succès, notification créée"]);
                } else {
                    echo json_encode(["error" => "Erreur lors de l'insertion de la notification : " . $conn->error]);
                }
            } else {
                echo json_encode(["error" => "Impossible de récupérer user_id pour la notification"]);
            }
        } else {
            echo json_encode(["error" => "Erreur lors de l'insertion dans l'historique des statuts: " . $conn->error]);
        }
        
        
        if ($conn->query($sql_history)) {
            echo json_encode(["message" => "Données insérées avec succès"]);
        } else {
            echo json_encode(["error" => "Erreur lors de l'insertion dans l'historique des statuts: " . $conn->error]);
        }
    } else {
        echo json_encode(["error" => "Erreur lors de l'insertion des données: " . $conn->error]);
    }
}
// Fermer la connexion
$conn->close();
?>
