// components/UserReactions.js
import { useEffect, useState } from 'react';

const UserReactions = ({ posts }) => {
    const [userId, setUserId] = useState(null);
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
        haha: '😂',
        wow: '😮',
        sad: '😢',
        angry: '😡'
    };

    return (
        <div>
            {posts.map((post) => (
                <div key={post.id}>
                    {reactionEmojis[reactions[post.id]] || MySvgIcon}
                </div>
            ))}
        </div>
    );
};

export default UserReactions;
