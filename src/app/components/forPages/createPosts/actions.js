'use client';

import { useState, useEffect } from 'react';

export const usePostActions = () => {
    const [postText, setPostText] = useState('');
    const [loading, setLoading] = useState(false); // État de chargement

    // Fonction pour charger les posts
    const loadPosts = async () => {
        // Vous pouvez supprimer cette fonction si vous ne la utilisez plus
    };

    const handleShare = async () => {
        try {
            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/posts/create_post.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ text: postText }),
            });

            const data = await response.json(); // Récupérer la réponse en JSON

            if (response.ok) {
                // Ne pas gérer les posts ici
                setPostText(''); // Effacer le texte après un partage réussi
            } else {
                console.error('Erreur du serveur : ', data.message);
            }
        } catch (error) {
            setPostText('');
            console.error('Erreur de connexion : ', error.message);
        }
    };

    return { postText, setPostText, handleShare, loading }; // Ne plus retourner posts
};
