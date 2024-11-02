'use client';

import React, { useState, useEffect } from 'react';

export default function ProfilePhoto({ size }) {
    const [avatarUrl, setAvatarUrl] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [userId, setUserId] = useState(null);
    let width = 'w-12';

    if (size === 'lg') {
        width = 'w-12 md:w-24';
    } else if (size === 'sm') {
        width = 'w-8';
    }

    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

    const fetchAvatar = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/profile_photo.json');
            const data = await response.json();
            const userAvatar = data.find(photo => photo.user_id === userId);
            if (userAvatar) {
                setAvatarUrl(userAvatar.photo_path);
            } else {
                console.log("Aucun avatar trouvé pour l'utilisateur.");
            }
        } catch (error) {
            console.error("Erreur lors de la récupération de l'avatar :", error);
        }
    };

    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        if (userId) {
            fetchAvatar();
        }
    }, [userId]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const formData = new FormData();
            formData.append("profile_photo", file);
            formData.append("user_id", userId);

            try {
                const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/users/updateProfilePhoto.php", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (response.ok) {
                    alert("Avatar mis à jour avec succès !");
                    fetchAvatar();
                } else {
                    throw new Error("Erreur lors de la mise à jour de l'avatar.");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Échec du téléchargement de l'avatar.");
            }
        }
    };

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
