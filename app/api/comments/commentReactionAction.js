import React, { useState, useEffect, useRef } from 'react';

const Reaction = ({ commentId }) => {
    const [reactionCount, setReactionCount] = useState(0);
    const [userId, setUserId] = useState(null);
    const [reactionType, setReactionType] = useState(null);
    const [showEmojis, setShowEmojis] = useState(false); // State to manage emoji display
    const reactionRef = useRef(null); // Reference for detecting outside clicks
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

    // Log the commentId to the console for verification
    useEffect(() => {
        console.log("Current commentId:", commentId);
    }, [commentId]);

    // Function to fetch user ID from userId.txt
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Error fetching user ID:", error);
        }
    };

    useEffect(() => {
        fetchUserId(); // Fetch user ID when component mounts
    }, []);

    useEffect(() => {
        if (!userId) return; // Don't fetch reactions if userId is not yet set

        const fetchReactions = async () => {
            try {
                // Fetch the reactions JSON file
                const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/comments/commentReaction.json');
                const data = await response.json();
                console.log("All reactions data:", data); 
        
                // Filter reactions for the connected user
                const userReactions = data.filter(
                    (reaction) => reaction.user_id === userId // Change userId to user_id
                );
                console.log("User reactions filtered:", userReactions);
        
                // Create an object to associate reactions by comment_id
                const reactionsByComment = {};
                userReactions.forEach((reaction) => {
                    reactionsByComment[reaction.comment_id] = reaction.reaction_type; // Change commentId to comment_id and reactionType to reaction_type
                });
                console.log("Reactions by post:", reactionsByComment);
        
                setReactions(reactionsByComment);
            } catch (error) {
                console.error('Error fetching reactions:', error);
            }
        };
        

        fetchReactions();
    }, [userId]);

    const handleReaction = async (type) => {
        if (!userId) {
            console.error("User ID is not available.");
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
                // Update reactions state
                setReactions((prevReactions) => ({
                    ...prevReactions,
                    [commentId]: type
                }));
            } else {
                console.error(result.error);
            }
        } catch (error) {
            console.error("Error during request:", error);
        }
        window.location.reload();
    };

    // Handle outside clicks to close emoji menu
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (reactionRef.current && !reactionRef.current.contains(event.target)) {
                setShowEmojis(false); // Close emoji menu if clicked outside
            }
        };

        // Add event listener for clicks
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up event listener when component unmounts
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
                {/* Display the selected emoji or the default icon */}
                <div key={commentId}>
                    {reactionEmojis[reactions[commentId]] || MySvgIcon}
                </div>
            </span>
            {/* Emoji menu */}
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
