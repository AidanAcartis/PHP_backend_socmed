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
    const { photoText, setPhotoText, handlePhotoSubmit, Loading } = usePhotoActions();
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
        formData.append("user_id", fileUserId || userId); // Utiliser fileUserId si disponible, sinon userId
        formData.append("content", postText); // Ajout du texte dans formData
        
        console.log("user_id:", fileUserId || userId);
        console.log("content:", postText);

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
    
        setPostText(''); // Effacer le texte après un partage réussi
         window.location.reload();
    };

    const renderLoading = () => {
        if (loading) {
            return <div className="text-blue-500">Chargement...</div>;
        }
        return null;
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target)) {
                setShowUpload(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div>
            <Card>
            <div className="flex gap-1">
                <div>
                    <ProfilePhoto />
                </div>
                <div className="flex flex-col grow" ref={inputRef}>
                    <textarea
                        className="grow p-3 h-14"
                        placeholder="What's on your mind?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onClick={() => setShowUpload(true)}
                    />
                    {showUpload && <UploadForm onFileSelected={handleFileSelected} />}
                </div>
            </div>
            {renderLoading()}
            <div className="flex gap-5 mt-2 items-center">
                {/* <div>
                    <button className="flex gap-2" onClick={handlePhotoButtonClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span className="hidden md:block">Photos</span>
                    </button>
                </div>*/}
                {/* ... autres boutons ... 
                    <div>
                        <UploadForm />
                    </div>
                */}
                    <div>
                        <button className="flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                            </svg>
                            <span className="hidden md:block">People</span>
                        </button>
                    </div>
                    <div>
                        <button className="flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span className="hidden md:block">Check in</span>
                        </button>
                    </div>
                    <div>
                        <button className="flex gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
                            </svg>
                            <span className="hidden md:block">Mood</span>
                        </button>
                    </div>
                <div className="flex gap-5 mt-2 items-center">
                    <div className="grow text-right">
                        <button
                            className="bg-socialBlue text-white px-4 py-1 rounded-md"
                            onClick={handleShareClick}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </Card>
            <MyLocation userId={userId} />
            <AboutMeForm userId={userId} />
        </div>
    );
}
