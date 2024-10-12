'use client';

import Card from "../Cards.js";
import Avatar from "../Avatar.js";

import { useEffect, useState } from 'react';
import { usePhotoActions } from "./PhotoActions.js";
import { usePostActions } from "./actions.js";

export default function PostFormCard({ userId }) {
    const { photoText, setPhotoText, handlePhotoSubmit, Loading } = usePhotoActions(); // Mettez à jour pour utiliser handlePhotoSubmit
    const [isPhotoLink, setIsPhotoLink] = useState(false);
    const { postText, setPostText, handleShare, loading } = usePostActions(); // Récupération des actions et des états

    const handleShareClick = async () => {
        await handleShare(); // Attendre que le post soit partagé
        setPostText(''); // Effacer le texte après un partage réussi
        window.location.reload(); // Recharger la page pour afficher le nouveau post
    };

    const handleSubmitClick = async () => {
        // Appelle handlePhotoSubmit directement au lieu de handleShare
        await handlePhotoSubmit();
        window.location.reload(); // Recharger la page après le partage
    };

    const handlePhotoButtonClick = () => {
        setIsPhotoLink(!isPhotoLink); // Alterner l'état
    };

    const renderLoading = () => {
        if (loading) {
            return <div className="text-blue-500">Chargement...</div>;
        }
        return null;
    };

    return (
        <Card>
            <div className="flex gap-1">
                <div>
                    <Avatar />
                </div>
                {isPhotoLink ? (
                    <div className="flex grow">
                        <input
                            type="text"
                            className="grow p-3 h-14"
                            placeholder="Entrez le lien de la photo"
                            value={photoText}
                            onChange={(e) => setPhotoText(e.target.value)}
                        />
                        <button
                            onClick={handleSubmitClick}
                            className="ml-2 p-3 h-10 bg-blue-500 text-white rounded"
                        >
                            Submit
                        </button>
                    </div>
                ) : (
                    <textarea
                        className="grow p-3 h-14"
                        placeholder="Que pensez-vous, Nekota ?"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                    />
                )}
            </div>
            {renderLoading()}
            <div className="flex gap-5 mt-2 items-center">
                <div>
                    <button className="flex gap-2" onClick={handlePhotoButtonClick}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                        </svg>
                        <span className="hidden md:block">Photos</span>
                    </button>
                </div>
                {/* ... autres boutons ... */}
                
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
                            className="bg-socialBlue text-white px-6 py-1 rounded-md"
                            onClick={handleShareClick}
                        >
                            Share
                        </button>
                    </div>
                </div>
            </div>
        </Card>
    );
}
