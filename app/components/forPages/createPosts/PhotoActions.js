'use client';

import { useState } from 'react';

export const usePhotoActions = () => {
    const [photoText, setPhotoText] = useState('');
    const [Loading, setLoading] = useState(false);

    // Fonction pour gérer la soumission du lien de photo
    const handlePhotoSubmit = async () => {
        if (!photoText) {
            console.error('Le lien de la photo est manquant');
            return;
        }

        setLoading(true);
        try {
            // Soumettre la photo pour créer un nouveau post
            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/posts/get_photo.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ photo_url: photoText }),
            });

            const data = await response.json();

            if (response.ok) {
                setPhotoText('');
                console.log('Réponse du serveur : ', data.message);
            } else {
                console.error('Erreur du serveur : ', data.message);
            }
        } catch (error) {
            console.error('Erreur de connexion : ', error.message);
        } finally {
            setLoading(false);
        }
    };

    return { photoText, setPhotoText, handlePhotoSubmit, Loading };
};
