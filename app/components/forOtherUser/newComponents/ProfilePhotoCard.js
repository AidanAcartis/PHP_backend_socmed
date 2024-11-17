// pages/profile.js
'use client';

import { useEffect, useState } from 'react';
import { getUserProfilePhoto } from './otherProfilePhoto';

const ProfilePhotoCard = ({ userId }) => {
    const [avatarUrl, setAvatarUrl] = useState(null);

    useEffect(() => {
        const fetchAvatar = async () => {
            const photoUrl = await getUserProfilePhoto(userId);
            if (photoUrl) {
                setAvatarUrl(photoUrl);
            }
        };

        fetchAvatar();
    }, [userId]); // Recharger si userId change

    return (
        <div className="flex items-center">
            <div className="rounded-full overflow-hidden w-12 h-12">
                <img 
                    src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                    alt="avatar" 
                    className="object-cover w-full h-full" 
                />
            </div>
        </div>
    );
};

// Exportation du composant à la fin, pour éviter l'erreur
export default ProfilePhotoCard;
