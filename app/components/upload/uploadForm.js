import React, { useState, useEffect } from 'react';

export default function UploadForm({ onFileSelected }) {
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

    // Charger l'ID utilisateur une seule fois au montage
    useEffect(() => {
        fetchUserId();
    }, []);

    // Fonction pour gérer la sélection du fichier
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        // Vérifiez que l'ID utilisateur est présent
        if (file && userId) {
            onFileSelected(file, userId);
            console.log("Fichier sélectionné :", file);
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15V21h9V15M10.5 9V3h3v6m-7.5 4h3m5.25-9h4.5m-4.5 0l2.25-2.25m-2.25 2.25L15.75 3" />
                    </svg>
                    <span className="text-black">Upload</span>
                </label>
            </div>
        </div>
    );
}
