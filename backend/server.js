import express from 'express';
import cors from 'cors';
import path from 'path';
import mysql from 'mysql';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Activer CORS pour toutes les origines
app.use(cors());

// Connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'jennie',
    password: 'Str0ng!P@ssw0rd2024',
    database: 'social_media_db'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        process.exit(1);
    } else {
        console.log('Connexion à la base de données réussie');
    }
});

// Route SSE pour envoyer les notifications
app.get('/notifications/sse/:userId', (req, res) => {
    const userId = req.params.userId; // Récupérer l'ID de l'utilisateur à partir de l'URL

    // Définir l'en-tête de réponse pour le flux SSE
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    // Fonction pour envoyer les notifications non lues
    function sendUnreadNotifications() {
        db.query(
            'SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0',
            [userId],
            (err, results) => {
                if (err) {
                    console.error('Erreur de requête:', err);
                    res.write('data: Erreur de requête\n\n');
                } else {
                    const unreadCount = results[0].unread_count;
                    res.write(`data: {"unread_count": ${unreadCount}}\n\n`);
                }
            }
        );
    }

    // Envoyer les notifications toutes les 5 secondes
    const intervalId = setInterval(sendUnreadNotifications, 1000);

    // Fermer la connexion après un certain temps ou lorsque la requête est fermée
    req.on('close', () => {
        clearInterval(intervalId);
    });
});

// Définir la route pour accéder à fichier.txt
app.get('/Devoi_socila_media/src/backend/controllers/users/fichier.txt', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/fichier.txt');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Définir la route pour accéder à post.json
app.get('/Devoi_socila_media/src/backend/controllers/posts/createPost/posts.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/posts/createPost/posts.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Définir la route pour accéder à post.json
app.get('/Devoi_socila_media/src/backend/controllers/comments/comments.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/comments/comments.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Définir la route pour accéder à post.json
app.get('/Devoi_socila_media/src/backend/controllers/reactions/reactions.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/reactions/reactions.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

app.get('/Devoi_socila_media/src/backend/controllers/users/userId.txt', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/userId.txt');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

app.get('/Devoi_socila_media/src/backend/controllers/comments/commentReaction.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/comments/commentReaction.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

app.get('/Devoi_socila_media/src/backend/controllers/users/cover_photo.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/cover_photo.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

app.get('/Devoi_socila_media/src/backend/controllers/users/profile_photo.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/profile_photo.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

app.get('/Devoi_socila_media/src/backend/controllers/posts/createPost/userFile.json', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/posts/createPost/userFile.json');
    res.sendFile(filePath, (err) => {
        if (err) {
            console.error('Erreur lors de l\'envoi du fichier:', err);
            res.status(err.status || 500).end();
        } else {
            console.log('Fichier envoyé:', filePath);
        }
    });
});

// Écoute sur le port 3003
app.listen(3003, () => {
    console.log('Server running on port 3003');
});
