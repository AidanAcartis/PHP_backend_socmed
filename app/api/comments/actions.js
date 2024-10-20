'use client';

import { useState } from 'react';

export const useCommentActions = () => {
    const [commText, setCommText] = useState('');
    const [loading, setLoading] = useState(false); // État de chargement

    const handleShare = async (postId, userId) => {
        try {
            const bodyData = {
                postId: postId,
                content: commText,
                userId: userId
            };

            console.log("Données à envoyer :", bodyData); // Ajoute ceci pour déboguer

            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/comments/add_comment.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(bodyData),
            });

            const data = await response.json(); // Récupérer la réponse en JSON

            if (response.ok) {
                setCommText(''); // Effacer le texte après un partage réussi
            } else {
                console.error('Erreur du serveur : ', data.message); // Affiche le message d'erreur
            }
        } catch (error) {
            console.error('Erreur de connexion : ', error.message);
            setCommText('');
        }
        window.location.reload();
    };

    return { commText, setCommText, handleShare, loading }; 
};
