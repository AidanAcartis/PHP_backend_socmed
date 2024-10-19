// components/UserReactions.js
import { useEffect, useState } from 'react';

const UserReactions = ({ posts }) => {
    const [userId, setUserId] = useState(null);
    const [reactions, setReactions] = useState({});

    useEffect(() => {
        const fetchUserId = async () => {
            try {
                // Fetch the userId from the userId.txt file
                const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
                const userIdText = await response.text();
                setUserId(userIdText.trim()); // Trim to remove any extra spaces or newlines
            } catch (error) {
                console.error('Erreur lors de la récupération du userId:', error);
            }
        };

        fetchUserId();
    }, []);

    useEffect(() => {
        if (!userId) return; // Don't fetch reactions if userId is not yet set

        const fetchReactions = async () => {
            try {
                // Fetch the reactions JSON file
                const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/reactions/reactions.json');
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

    // Map des réactions pour les afficher sous forme d'emoji
    const reactionEmojis = {
        like: '👍',
        love: '❤️',
        laugh: '😂',
        wow: '😮',
        sad: '😢',
        angry: '😡'
    };

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    {reactionEmojis[reactions[post.id]] || 'Aucune réaction'}
                </div>
            ))}
        </div>
    );
};

export default UserReactions;
