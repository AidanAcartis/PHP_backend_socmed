import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Activer CORS pour toutes les origines
app.use(cors());

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

// Écoute sur le port 3003
app.listen(3003, () => {
    console.log('Server running on port 3003');
});
