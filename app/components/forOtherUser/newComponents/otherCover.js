// otherCover.js
import React, { useState, useEffect } from 'react';

export default function OtherCover(userId) { // Déstructurer `userId`

    // Fonction pour récupérer l'URL de la photo de couverture de l'utilisateur
    const fetchCoverPhoto = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/cover_photo.json');
            const data = await response.json();
            
            // Recherche de la photo de couverture de l'utilisateur connecté
            const userCover = data.find(photo => photo.user_id === userId);
            if (userCover) {
                setCoverUrl(userCover.photo_path);
            } else {
                console.log("Aucune photo de couverture trouvée pour l'utilisateur.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de la photo de couverture :", error);
        }
    };

}
