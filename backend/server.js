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

// Activer CORS pour l'origine spécifique (par exemple, le frontend en développement)
app.use(cors({
    origin: 'http://localhost:3000', // Spécifie l'origine de ton frontend
    methods: ['GET', 'POST']
}));

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000', // URL de ton frontend
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
        process.exit(1); // Quitte le serveur si la connexion échoue
    }
}

// Connexion à la base de données
let db;
connectToDatabase().then(connection => {
    db = connection;
}).catch(err => {
    console.error('Erreur de connexion à la base de données:', err);
    process.exit(1); // Quitte le serveur si la connexion échoue
});

// Route pour la racine, servant une page HTML ou un fichier
app.get('/', (req, res) => {
    res.send('<h1>Bienvenue sur le serveur!</h1>');
});

io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket:', socket.id);

    // Recevoir un message privé
    socket.on('sendPrivateMessage', async (data) => {
        const { senderId, receiverId, content } = data;
        console.log('Message privé reçu:', data);

        try {
            // Insertion du message privé dans la base de données
            const [result] = await db.query(
                'INSERT INTO private_messages (sender_id, receiver_id, content, sent_at) VALUES (?, ?, ?, ?)',
                [senderId, receiverId, content, new Date()]
            );

            // Vérification si le destinataire est connecté
            const receiverSocket = io.sockets.sockets.get(receiverId);
            if (receiverSocket) {
                // Envoi du message au destinataire si connecté
                receiverSocket.emit('receivePrivateMessage', {
                    senderId,
                    receiverId,
                    content,
                    sentAt: new Date(),
                });
                console.log('Message privé envoyé au destinataire');
            } else {
                console.log('Destinataire non connecté, message non envoyé');
            }

            console.log('Message privé inséré avec succès dans la base de données');
        } catch (err) {
            console.error('Erreur lors de l\'insertion du message privé:', err);
            socket.emit('error', 'Erreur d\'insertion du message privé');
        }
    });

   // Récupérer les messages privés entre deux utilisateurs
socket.on('getMessages', async (data) => {
    const { senderId, receiverId } = data;
    try {
        const [messages] = await db.query(
            `SELECT 
                pm.sender_id, 
                pm.receiver_id, 
                pm.content, 
                pm.sent_at, 
                sender.username AS sender_username, 
                receiver.username AS receiver_username
            FROM private_messages pm
            JOIN users sender ON pm.sender_id = sender.id
            JOIN users receiver ON pm.receiver_id = receiver.id
            WHERE (pm.sender_id = ? AND pm.receiver_id = ?) 
               OR (pm.sender_id = ? AND pm.receiver_id = ?)
            ORDER BY pm.sent_at ASC`,
            [senderId, receiverId, receiverId, senderId]
        );

        // Afficher les messages dans la console (données JSON)
        console.log('Messages privés récupérés:', JSON.stringify(messages));

        // Envoi des messages au client
        socket.emit('receiveMessages', messages);
    } catch (err) {
        console.error('Erreur lors de la récupération des messages privés:', err);
        socket.emit('error', 'Erreur lors de la récupération des messages privés');
    }
});

});


io.on('connection', (socket) => {
    console.log('Nouvelle connexion WebSocket:', socket.id);

    // Récupérer tous les messages au moment de la connexion
    socket.on('getForumMessages', async () => {
        try {
            // Récupérer les messages et le nom d'utilisateur correspondant à sender_id
            const [rows] = await db.query(
                `SELECT fm.sender_id, fm.content, fm.sent_at, u.username 
                 FROM forum_messages fm
                 JOIN users u ON fm.sender_id = u.id
                 ORDER BY fm.sent_at`
            );
            
            // Envoi des messages à l'utilisateur qui vient de se connecter
            socket.emit('receiveForumMessages', rows);
        } catch (err) {
            console.error("Erreur lors de la récupération des messages:", err);
            socket.emit('error', 'Erreur de récupération des messages'); // Informer le client de l'erreur
        }
    });

    socket.on('sendForumMessage', async (data) => {
        const { senderId, content } = data;
        console.log('Message reçu du client:', data); // Pour le débogage

        try {
            // Insertion du message dans la base de données avec le champ sent_at
            await db.query(
                'INSERT INTO forum_messages (sender_id, content, sent_at) VALUES (?, ?, ?)',
                [senderId, content, new Date()]
            );

            // Récupérer le nom d'utilisateur de l'envoyeur pour envoyer avec le message
            const [userRow] = await db.query(
                'SELECT username FROM users WHERE id = ?',
                [senderId]
            );

            const username = userRow[0]?.username || 'Utilisateur inconnu';

            // Envoi du message à tous les clients connectés, y compris le username
            io.emit('receiveForumMessage', {
                senderId,
                content,
                sentAt: new Date(),
                username
            });
        } catch (err) {
            console.error("Erreur lors de l'insertion du message de forum:", err);
            socket.emit('error', 'Erreur d\'insertion du message'); // Informer le client de l'erreur
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
