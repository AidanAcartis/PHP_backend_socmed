import React, { useState, useEffect, useRef } from 'react';

const Reaction = ({ commentId }) => {
    const [reactionCount, setReactionCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [reactionType, setReactionType] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false); // État pour gérer l'affichage des emojis
    const reactionRef = useRef(null); // Référence pour détecter les clics à l'extérieur
    const [reactions, setReactions] = useState({});

    const MySvgIcon = (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
            />
        </svg>
    );

    // Fonction pour récupérer l'ID de l'utilisateur depuis le fichier userId.txt
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID de l'utilisateur:", error);
        }
    };

    useEffect(() => {
        fetchUserId(); // Appeler la fonction pour récupérer l'ID de l'utilisateur lors du montage du composant
    }, []);

    useEffect(() => {
        if (!userId) return; // Don't fetch reactions if userId is not yet set

        const fetchReactions = async () => {
            try {
                // Fetch the reactions JSON file
                const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/comments/commentReaction.json');
                const data = await response.json();

                // Filter reactions for the connected user
                const userReactions = data.filter(
                    (reaction) => reaction.userId === userId
                );

                // Create an object to associate reactions by postId
                const reactionsByPost = {};
                userReactions.forEach((reaction) => {
                    reactionsByPost[reaction.postId] = reaction.reaction;
                });

                setReactions(reactionsByPost);
            } catch (error) {
                console.error('Erreur lors de la récupération des réactions:', error);
            }
        };

        fetchReactions();
    }, [userId]);

    const handleReaction = async (type) => {
        if (!userId) {
            console.error("L'ID de l'utilisateur n'est pas disponible.");
            return;
        }

        setReactionType(type);

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
                    reaction_type: type
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

    // Gérer les clics à l'extérieur pour fermer le menu des emojis
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (reactionRef.current && !reactionRef.current.contains(event.target)) {
                setShowEmojis(false); // Fermer le menu des emojis si le clic est en dehors du composant
            }
        };

        // Ajouter un écouteur d'événements pour les clics
        document.addEventListener('mousedown', handleClickOutside);

        // Nettoyer l'écouteur d'événements lorsqu'on démonte le composant
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const reactionEmojis = {
        like: '👍',
        dislike: '👎'
    };

    return (
        <div className="relative" ref={reactionRef}>
            <span
                onClick={() => setShowEmojis(!showEmojis)}
            >
                {/* Afficher l'icône sélectionnée ou "Réagir" */}
                {reactionEmojis[reactions[commentId]] || MySvgIcon}
            </span>
            {/* Affichage des emojis */}
            {showEmojis && (
                <div className="absolute bottom-full mb-1 flex gap-2 bg-white rounded-md shadow-lg p-2">
                    <button onClick={() => handleReaction('like')}>👍</button>
                    <button onClick={() => handleReaction('dislike')}>👎</button>
                </div>
            )}
        </div>
    );
};

export default Reaction;
