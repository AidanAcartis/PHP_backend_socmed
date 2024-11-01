import React, { useState, useEffect } from 'react';

export default function UploadForm() {
    const [userId, setUserId] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);

    // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'ID utilisateur.");
            }
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

    // Effect pour charger l'ID utilisateur une seule fois au montage
    useEffect(() => {
        fetchUserId();
    }, []);

    // Fonction pour gérer la sélection et l'envoi du fichier
    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Vérifiez que le fichier et l'ID utilisateur sont présents
        if (file && userId) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("user_id", userId);

            console.log("Fichier sélectionné :", file);
            console.log("FormData avant envoi :");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            try {
                const response = await fetch("http://localhost/Devoi_socila_media/src/backend/models/upload.php", {
                    method: 'POST',
                    credentials: 'include',
                    body: formData
                });

                if (response.ok) {
                    const result = await response.json();
                    alert(result.message);
                } else {
                    const errorText = await response.text(); // Lire la réponse texte pour le débogage
                    throw new Error("Erreur lors de la mise à jour du fichier : " + errorText);
                }
            } catch (error) {
                console.error("Erreur:", error);
                alert("Échec du téléchargement du fichier.");
            }
        } else {
            console.error("ID utilisateur ou fichier non sélectionné.");
            alert("Veuillez sélectionner un fichier et vous assurer que l'ID utilisateur est chargé.");
        }
    };

    return (
        <div>
            <div className="flex gap-2">
                <label className="flex gap-1 items-center bg-white py-1 px-2 rounded-md shadow-md shadow-black cursor-pointer">
                    <input type="file" className="hidden" onChange={handleFileChange} />
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                </label>
            </div>
        </div>
    );
}
