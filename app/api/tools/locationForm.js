'use client';

import Card from "../Cards.js";
import Avatar from "../Avatar.js";
import { useEffect, useRef, useState } from 'react';
import { usePhotoActions } from "./PhotoActions.js";
import { usePostActions } from "./actions.js";
import UploadForm from "../../upload/uploadForm.js";
import ProfilePhoto from "../ProfilePhoto.js";
import AboutMeForm from "../../../api/about/AboutMe.js";
import MyLocation from "../../../api/location/locationForm.js";

export default function PostFormCard() {
    const { postText, setPostText, handleShare, loading } = usePostActions();
    const [showUpload, setShowUpload] = useState(false);
    const inputRef = useRef(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUserId, setFileUserId] = useState(null);
    const [userId, setUserId] = useState(null); // Ajouter un état pour l'ID utilisateur

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

    const handleFileSelected = (file) => {
        setSelectedFile(file);
        setFileUserId(userId); // Utiliser l'userId déjà récupéré
        console.log("Fichier reçu dans PostFormCard:", file);
        console.log("userId reçu dans PostFormCard:", userId);
    };

    const handleShareClick = async () => {
        const formData = new FormData();
        if (selectedFile) {
            formData.append("file", selectedFile);
    
            // Log pour afficher les données ajoutées à formData
            console.log("Contenu de formData avec fichier :");
            console.log("file:", selectedFile.name, "| Taille:", selectedFile.size, "| Type:", selectedFile.type);
            
            // Déterminer le dossier en fonction du type de fichier
            let folder;
            if (selectedFile.type.startsWith('image/')) {
                folder = 'photos';
            } else if (selectedFile.type.startsWith('application/pdf')) {
                folder = 'pdfs';
            } else if (selectedFile.type.startsWith('video/')) {
                folder = 'videos';
            } else {
                console.error('Type de fichier non supporté');
                return;
            }
    
            const docUrl = `http://localhost/Devoi_socila_media/public/documents/${folder}/${selectedFile.name}`;
        } else {
            formData.append("file", null);
            console.log("Aucun fichier sélectionné, envoi uniquement du texte.");
        }
    
        try {
            console.log("Début du fetch vers create_post.php...");
            const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/posts/createPost/create_post.php", {
                method: 'POST',
                credentials: 'include',
                body: formData
            });
            console.log("Fetch terminé, en attente de la réponse...");
    
            const responseText = await response.text();
            console.log("Réponse brute reçue :", responseText);
    
            try {
                const result = JSON.parse(responseText);
                console.log("Réponse JSON reçue :", result);
                alert(result.message);
    
                if (selectedFile) {
                    const docType = selectedFile.type.startsWith('video/') ? 'video' : (selectedFile.type === 'application/pdf' ? 'pdf' : 'photo');
                    //await createPost(result.message, docUrl, docType);
                }
            } catch (jsonError) {
                console.error("Erreur de parsing JSON :", jsonError);
                alert("Erreur de format dans la réponse du serveur.");
            }
        } catch (error) {
            console.error("Erreur lors de l'envoi :", error);
            alert("Échec de l'envoi.");
        }
    };

    return (
        <div>
            <Card>
            <div className="flex gap-1">
                <div className="flex flex-col grow" ref={inputRef}>
                  Upload
                   <UploadForm onFileSelected={handleFileSelected} />
                </div>
            </div>
        </Card>
        </div>
    );
}
