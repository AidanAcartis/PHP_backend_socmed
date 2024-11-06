'use client';

import React, { useState, useEffect } from 'react';

export default function OtherProfilePhoto(size, userId) {
    const [avatarUrl, setAvatarUrl] = useState('');
    let width = 'w-12';

    if (size === 'lg') {
        width = 'w-12 md:w-24';
    } else if (size === 'sm') {
        width = 'w-8';
    }

    useEffect(() => {
        const fetchAvatar = async () => {
            if (!userId) {
                console.log("Aucun ID utilisateur fourni.");
                return;
            }
            try {
                console.log(`Fetching avatar for userId: ${userId}`);
                const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/users/get_profile_photo.php?userId=${userId}`);
                
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    console.log("Erreur dans la réponse:", response.statusText);
                    return;
                }
                
                const data = await response.json();
                console.log("Data received:", data);
                
                if (data.photo_path) {
                    console.log("Avatar found:", data.photo_path);
                    setAvatarUrl(data.photo_path);
                } else {
                    console.log("Aucun avatar trouvé pour l'utilisateur.");
                }
            } catch (error) {
                console.error("Erreur lors de la récupération de l'avatar :", error);
            }
        };

        fetchAvatar();
    }, [userId]);

    return (
        <div className={`${width} relative`}>
            <div className="rounded-full overflow-hidden">
                <img 
                    src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                    alt="avatar" 
                />
            </div>
        </div>
    );
}
