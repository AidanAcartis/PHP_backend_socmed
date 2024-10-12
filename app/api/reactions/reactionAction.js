const handleReactionClick = async (reaction) => {
    const reactionIcons = {
        like: '👍',
        love: '❤️',
        haha: '😂',
        sad: '😢',
        angry: '😡'
    };
    const selectedIcon = reactionIcons[reaction];
    setSelectedReaction(selectedIcon);
    setShowEmojis(false); 

    // Send the reaction to the server
    try {
        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/reactions/add_reaction.php', {
            method: 'POST',
            credentials: 'include', // Include credentials for session management
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                postId: postId,
                reaction: reaction
            })
        });

        const result = await response.json();
        console.log(result); // Handle the response from the server
    } catch (error) {
        console.error('Erreur lors de l\'envoi de la réaction :', error);
    }
};
