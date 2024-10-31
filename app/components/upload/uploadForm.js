// components/UploadForm.js
import { useState, useEffect } from 'react';

const UploadForm = () => {
    const [file, setFile] = useState(null);
    const [loggedInUserId, setLoggedInUserId] = useState(null);

    // Récupérer l'userId depuis l'URL et le stocker dans le sessionStorage
    useEffect(() => {
        const fetchUserId = async () => {
            try {
                const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
                if (!response.ok) {
                    throw new Error("Erreur lors de la récupération de l'userId.");
                }
                const text = await response.text();
                const userId = text.trim();
                sessionStorage.setItem('userId', userId);
                setLoggedInUserId(userId);
                console.log("User ID récupéré :", userId);
            } catch (error) {
                console.error("Erreur lors de la récupération de l'userId :", error);
            }
        };
        fetchUserId();
    }, []);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!file) {
            alert("Veuillez sélectionner un fichier.");
            return;
        }

        if (!loggedInUserId) {
            alert("L'utilisateur n'est pas identifié. Veuillez réessayer.");
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('user_id', loggedInUserId);

        try {
            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/models/upload.php', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                alert("Fichier téléchargé avec succès : " + data.message);
            } else {
                alert("Erreur lors du téléchargement du fichier.");
            }
        } catch (error) {
            console.error("Erreur : ", error);
            alert("Erreur lors du téléchargement du fichier.");
        }
    };

    // Function to trigger file input click
    const handleUploadClick = () => {
        document.getElementById('file').click();
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-1 items-center mt-1">
            <input
                type="file"
                name="file"
                id="file"
                onChange={handleFileChange}
                style={{ display: 'none' }} // Cacher l'élément input de fichier
            />
            <button type="submit" className="px-6 py-1 rounded-md">
                <div className="flex gap-2 items-center" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h-.75A2.25 2.25 0 0 0 4.5 9.75v7.5a2.25 2.25 0 0 0 2.25 2.25h7.5a2.25 2.25 0 0 0 2.25-2.25v-7.5a2.25 2.25 0 0 0-2.25-2.25h-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a2.25 2.25 0 0 1 2.25 2.25v7.5a2.25 2.25 0 0 1-2.25 2.25h-7.5a2.25 2.25 0 0 1-2.25-2.25v-.75" />
                    </svg>
                    <span className="bg-socialBlue text-white px-6 py-1 rounded-md hidden md:block">Upload</span>
                </div>
            </button>
        </form>
    );
};

export default UploadForm;
