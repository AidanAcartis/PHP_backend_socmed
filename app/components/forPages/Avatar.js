'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Avatar({ size }) {
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

    const pathname = usePathname();
    const isProfilePage = pathname === '/home/profile';

    return (
        <div className={`${width} relative`}>
            <div className="rounded-full overflow-hidden">
                <img 
                    src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                    alt="avatar" 
                />
            </div>
            {isProfilePage && (
                <div className="absolute bottom-[-5px] right-[-5px]">
                    <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md cursor-pointer">
                        <input type="file" className="hidden" onChange={handleFileChange} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 md:size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                    </label>
                </div>
            )}
        </div>
    );
}
