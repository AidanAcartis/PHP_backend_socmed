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

// Endpoint pour la répartition des signalements par `current_status`
app.get("/api/current-status-distribution", async (req, res) => {
    const query = "SELECT current_status, COUNT(*) as count FROM security_complaints GROUP BY current_status";
    try {
      const [results] = await db.query(query); // Attendre la résolution de la requête
      res.json(results); // Renvoie les résultats sous format JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
  });

  // Endpoint pour la répartition des signalements par `priority`
app.get("/api/priority-distribution", async (req, res) => {
    const query = "SELECT priority, COUNT(*) as count FROM security_complaints GROUP BY priority";
    try {
      const [results] = await db.query(query); // Attendre la résolution de la requête
      res.json(results); // Renvoie les résultats sous format JSON
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
  });
  

app.get("/api/geographic-distribution", async (req, res) => {
    const query = "SELECT location, COUNT(*) as count FROM signalements GROUP BY location";
    try {
      const [results] = await db.query(query); // Attendez la résolution de la promesse
      res.json(results); // Renvoie les résultats
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Erreur lors de la récupération des données." });
    }
  });
  
  // Endpoint : Signalements par personne
  // Endpoint : Signalements par personne
app.get("/api/reports-by-person", async (req, res) => {
    const query = "SELECT full_name, COUNT(*) as count FROM signalements GROUP BY full_name";
    
    try {
      // Exécutez la requête avec la version promise de MySQL
      const [results] = await db.query(query);
      res.json(results);
    } catch (err) {
      // Gérez les erreurs
      console.error(err);
      res.status(500).json({ error: "Une erreur est survenue lors de l'exécution de la requête." });
    }
  });
  
  

// Route 1 : Nombre total de plaintes
app.get('/api/plaintes/total', async (req, res) => {
    const query = 'SELECT COUNT(*) AS total FROM signalements';
    try {
        const [rows] = await db.execute(query);
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route : Répartition des plaintes par statut
app.get('/api/plaintes/repartition_status', async (req, res) => {
    const query = `
        SELECT current_status, COUNT(*) AS count
        FROM security_complaints
        GROUP BY current_status
    `;
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Route 2 : Répartition par statut
app.get('/api/plaintes/repartition', async (req, res) => {
    const query = `
        SELECT location, COUNT(*) AS count
        FROM signalements
        GROUP BY location
    `;
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route 3 : Types de violences signalées
app.get('/api/plaintes/types', async (req, res) => {
    const query = `
        SELECT description, COUNT(*) AS count
        FROM signalements
        GROUP BY description
    `;
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route 4 : Statistiques temporelles (par jour)
app.get('/api/plaintes/par-jour', async (req, res) => {
    const query = `
        SELECT DATE(created_at) AS jour, COUNT(*) AS count
        FROM signalements
        GROUP BY DATE(created_at)
        ORDER BY jour ASC
    `;
    try {
        const [results] = await db.execute(query);
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route 5 : Temps moyen de traitement
app.get('/api/plaintes/temps-moyen', async (req, res) => {
    const query = `
        SELECT TIMESTAMPDIFF(MINUTE, created_at, NOW()) AS temps_moyen
        FROM signalements
    `;
    try {
        const [results] = await db.execute(query);
        const total = results.reduce((sum, row) => sum + row.temps_moyen, 0);
        const moyenne = total / results.length || 0;
        res.json({ temps_moyen: moyenne });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Route pour trouver les postes de police à proximité
app.get('/nearby-police', async (req, res) => {
    const { latitude, longitude } = req.query;
    
    // Vérification des coordonnées reçues
    if (!latitude || !longitude) {
        return res.status(400).send('Latitude et longitude sont requises');
    }

    const apiKey = 'AIzaSyAnrbSjzC3195qmTINRW-yCsf6CVch-_PM'; // Remplace par ta clé API valide
    const radius = 5000; // Rayon de recherche en mètres

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=police&key=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        // Afficher les données dans la console
        console.log('Réponse API Google:', data);
            
        // Retourner les résultats au client
        res.json(data);
    } catch (error) {
        console.error('Erreur lors de la recherche des postes de police:', error);
        res.status(500).send('Erreur lors de la récupération des données');
    }
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

app.get('/Devoi_socila_media/src/backend/controllers/users/userType.txt', (req, res) => {
    const filePath = path.join(__dirname, 'controllers/users/userType.txt');
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
