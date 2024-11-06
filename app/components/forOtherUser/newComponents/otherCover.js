import React, { useState, useEffect } from 'react';

export default function OtherCover(userId) {
    const [coverUrl, setCoverUrl] = useState('');

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

    // Effect pour charger la photo de couverture une fois que l'ID utilisateur est défini
    useEffect(() => {
        if (userId) {
            fetchCoverPhoto();
        }
    }, [userId]);

    return (
        <div className="h-56 overflow-hidden flex justify-center items-start relative">
            <div>
               <img src={coverUrl || "https://static.zerochan.net/Anteater.Team.full.2361473.jpg"} alt="cover image" />
            </div>
        </div>
    );
}
