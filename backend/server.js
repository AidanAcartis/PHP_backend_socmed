import express from 'express';
import cors from 'cors';
import path from 'path';
import http from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';

// Obtenir le chemin du fichier actuel
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Activer CORS pour toutes les origines
//app.use(cors());

app.use(cors({
    origin: '*',  // Autoriser toutes les origines pour tester
    methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // URL de votre application Next.js
        methods: ['GET', 'POST']
    }
});

// Connexion à la base de données
async function connectToDatabase() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'jennie',
            password: 'Str0ng!P@ssw0rd2024',
            database: 'social_media_db'
        });
        console.log('Connexion à la base de données réussie');
        return db;
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
        process.exit(1);
    }
}

// Connexion à la base de données
let db;
connectToDatabase().then(connection => {
    db = connection;
});

// Route pour la racine, servant une page HTML ou un fichier
app.get('/', (req, res) => {
    res.send('<h1>Bienvenue sur le serveur!</h1>');
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket:', socket.id);

    // Récupérer tous les messages au moment de la connexion
    socket.on('getForumMessages', async () => {
        try {
            const [rows] = await db.query('SELECT * FROM forum_messages ORDER BY sent_at');
            // Envoi des messages à l'utilisateur qui vient de se connecter
            socket.emit('receiveForumMessages', rows);
        } catch (err) {
            console.error("Erreur lors de la récupération des messages:", err);
        }
    });

    socket.on('sendForumMessage', async (data) => {
        const { senderId, content } = data;
        console.log('Message reçu du client:', data); // Pour le débogage

        try {
            // Insertion du message dans la base de données
            await db.query(
                'INSERT INTO forum_messages (sender_id, content) VALUES (?, ?)',
                [senderId, content]
            );

            // Envoi du message à tous les clients connectés
            io.emit('receiveForumMessage', {
                senderId,
                content,
                sentAt: new Date()
            });
        } catch (err) {
            console.error("Erreur lors de l'insertion du message de forum:", err);
        }
    });
});


// WebSocket pour gérer les notifications
io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket:', socket.id);

    // Écouter les demandes de notifications
    socket.on('getNotifications', async (userId) => {
        try {
            // Récupérer le nombre de notifications non lues pour l'utilisateur
            const [results] = await db.query(
                'SELECT COUNT(*) AS unread_count FROM notifications WHERE user_id = ? AND is_read = 0',
                [userId]
            );
            const unreadCount = results[0].unread_count;

            // Émettre un événement à tous les clients
            io.emit('notificationUpdate', { unreadCount });
        } catch (err) {
            console.error('Erreur lors de la récupération des notifications:', err);
        }
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
server.listen(3003, () => {
    console.log('Server running on port 3003');
});
