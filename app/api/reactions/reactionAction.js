export const handleReactionClick = async (reactionType, postId, setSelectedReaction, setShowEmojis, setHovered) => {
    const reactionIcons = {
        like: '👍',
        love: '❤️',
        haha: '😂',
        sad: '😢',
        angry: '😡'
    };

    // Use the reactionType parameter instead of the undefined reaction variable
    const selectedIcon = reactionIcons[reactionType];
    setSelectedReaction(selectedIcon); // Update the selected icon
    setShowEmojis(false); // Hide the emojis after selection
    setHovered(false); // Make the hover disappear after selection

    // Send the reaction to the server
    try {
        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/reactions/add_reaction.php', {
            method: 'POST',
            credentials: 'include', // Include credentials for session management
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: postId, // Ensure postId is passed correctly
                reaction: reactionType // Pass the reactionType here
            })
        });

        const result = await response.json();
        console.log(result); // Process the server response
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la réaction :', error);
    }
};
