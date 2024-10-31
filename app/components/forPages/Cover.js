import React, { useState, useEffect } from 'react';

export default function Cover({ editable }) {
    const [coverUrl, setCoverUrl] = useState('');
    const [userId, setUserId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

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

    // Effect pour charger l'ID utilisateur une seule fois au montage
    useEffect(() => {
        fetchUserId();
    }, []);

    // Effect pour charger la photo de couverture une fois que l'ID utilisateur est défini
    useEffect(() => {
        if (userId) {
            fetchCoverPhoto();
        }
    }, [userId]);

    // Fonction pour gérer la sélection et l'envoi de la nouvelle photo de couverture
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const formData = new FormData();
            formData.append("cover_photo", file);
            formData.append("user_id", userId);

            console.log("Fichier sélectionné :", file);
            console.log("FormData avant envoi :");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            try {
                const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/users/updateCoverPhoto.php", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (response.ok) {
                    alert("Photo de couverture mise à jour avec succès !");
                    fetchCoverPhoto(); // Recharger la photo de couverture après la mise à jour
                } else {
                    throw new Error("Erreur lors de la mise à jour de la photo de couverture.");
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Échec du téléchargement de la photo.");
            }
        }
    };

    return (
        <div className="h-56 overflow-hidden flex justify-center items-start relative">
            <div>
               <img src={coverUrl || "https://static.zerochan.net/Anteater.Team.full.2361473.jpg"} alt="cover image" />
            </div>
            
                <div className="absolute right-8 bottom-8 m-2">
                    <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer">
                        <input type="file" className="hidden" onChange={handleFileChange} />
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
                        </svg>
                        Change Cover image
                    </label>
                </div>
            
        </div>
    );
}
