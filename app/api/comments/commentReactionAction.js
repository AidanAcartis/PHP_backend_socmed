import React, { useState, useEffect } from 'react';

const Reaction = ({ commentId }) => {
    const [reactionCount, setReactionCount] = useState(0);
    const [userId, setUserId] = useState(null); // État pour stocker l'ID de l'utilisateur
    const [reactionType, setReactionType] = useState(null); // État pour stocker le type de réaction

    // Fonction pour récupérer l'ID de l'utilisateur depuis le fichier userId.txt
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text(); // Récupérer l'ID de l'utilisateur sous forme de texte
            setUserId(userIdFromFile.trim()); // Mettre à jour l'état avec l'ID de l'utilisateur
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", error);
        }
    };

    useEffect(() => {
        fetchUserId(); // Appeler la fonction pour récupérer l'ID de l'utilisateur lors du montage du composant
    }, []);

    const handleReaction = async (type) => {
        if (!userId) {
            console.error("L'ID de l'utilisateur n'est pas disponible.");
            return;
        }

        setReactionType(type); // Mettre à jour le type de réaction

        try {
            const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/comments/comment_reaction.php', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    comment_id: commentId,
                    user_id: userId,
                    reaction_type: type // Utiliser le type de réaction passé en paramètre
                }),
            });

            const result = await response.json();

            if (result.success) {
                setReactionCount(prevCount => prevCount + 1);
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Erreur lors de la requête:", error);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <button onClick={() => handleReaction("like")} className="text-blue-500 hover:text-blue-700">
                J'aime
            </button>
            <button onClick={() => handleReaction("dislike")} className="text-red-500 hover:text-red-700">
                Je n'aime pas
            </button>
            <span>{reactionCount} réaction{reactionCount !== 1 ? 's' : ''}</span>
        </div>
    );
};

export default Reaction;
