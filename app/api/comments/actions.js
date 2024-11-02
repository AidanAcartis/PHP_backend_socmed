'use client';

import { useState, useEffect } from 'react';

export const useCommentActions = () => {
    const [commText, setCommText] = useState(''); // État pour le texte du commentaire
    const [loading, setLoading] = useState(false); // État de chargement
    const [userId, setUserId] = useState(''); // État pour l'ID utilisateur

    // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
    const fetchUserId = async () => {
        try {
            console.log("Début de la récupération de l'ID utilisateur...");
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            console.log("Statut de la réponse de l'ID utilisateur :", response.status);
            if (!response.ok) {
                throw new Error("Erreur de la réponse lors de la récupération de l'ID utilisateur");
            }
            const userIdFromFile = await response.text();
            console.log("ID utilisateur récupéré :", userIdFromFile.trim());
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

    // Utiliser useEffect pour appeler fetchUserId au chargement du composant
    useEffect(() => {
        fetchUserId();
    }, []);

    // Fonction pour gérer le partage de commentaire
    const handleShare = async (postId) => {
        setLoading(true); // Démarre l'indicateur de chargement
        try {
            const bodyData = {
                postId: postId,
                content: commText,
                userId: userId // Utiliser userId récupéré dans fetchUserId
            };

            console.log("Données à envoyer :", bodyData); // Affiche les données envoyées pour débogage

            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/comments/add_comment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(bodyData),
            });

            const responseText = await response.text(); // Récupérer la réponse sous forme de texte
            console.log("Contenu de la réponse :", responseText); // Vérifie ce qui est renvoyé

            console.log("Statut de la réponse :", response.status);
            console.log("Type de contenu de la réponse :", response.headers.get("content-type"));

            const data = JSON.parse(responseText); // Tente de parser la réponse manuellement
            console.log("Réponse du serveur :", data);

            if (response.ok) {
                console.log("Réponse du serveur :", data); // Affiche la réponse JSON du serveur
                setCommText(''); // Effacer le texte après un partage réussi
            } else {
                console.error('Erreur du serveur : ', data.message); // Affiche le message d'erreur du serveur
            }
        } catch (error) {
            console.error('Erreur de connexion : ', error.message); // Affiche les erreurs de connexion
            setCommText('');
        } finally {
            setLoading(false); // Arrête l'indicateur de chargement
        }
        window.location.reload();
    };

    return { commText, setCommText, handleShare, loading }; 
};
