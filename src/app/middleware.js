import express from 'express';
import cookieParser from 'cookie-parser';
import mysql from 'mysql'; // Assurez-vous que votre environnement prend en charge les modules ES

const app = express();

// Middleware pour analyser les cookies
app.use(cookieParser());

// Configurer la connexion à la base de données
const db = mysql.createConnection({
    host: 'localhost',
    user: 'jennie',
    password: 'Str0ng!P@ssw0rd2024',
    database: 'social_media_db'
});

// Middleware pour vérifier l'authentification
function authMiddleware(req, res, next) {
    // Vérifier si l'utilisateur est connecté par session
    if (req.session && req.session.user_logged_in) {
        return next(); // L'utilisateur est connecté, passez au middleware suivant
    }

    // Vérifier si le cookie d'authentification est présent
    const authToken = req.cookies.authToken;

    if (authToken) {
        // Vérification du token dans la base de données
        const query = 'SELECT user_id FROM auth_tokens WHERE token = ?';
        db.query(query, [authToken], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Erreur de serveur.' });
            }
            if (results.length > 0) {
                req.session.user_logged_in = true; // Définir la session comme connectée
                req.session.user_id = results[0].user_id; // Stocker l'ID de l'utilisateur dans la session
                return next(); // L'utilisateur est authentifié, passez au middleware suivant
            } else {
                return res.status(403).json({ error: 'Accès non autorisé.' });
            }
        });
    } else {
        // Si l'utilisateur n'est pas authentifié, renvoyez une erreur ou redirigez
        return res.status(403).json({ error: 'Accès non autorisé.' });
    }
}

// Utilisation du middleware dans les routes protégées
app.use('/protected-route', authMiddleware, (req, res) => {
    res.json({ message: 'Vous avez accès à cette route protégée.' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 3004;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
