export const handleDeletePost = async (post) => {
    if (confirm("Voulez-vous vraiment supprimer ce post ?")) {
        try {
            console.log(`Suppression du post avec l'ID : ${post.id}`);
            const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/controllers/posts/deletePost/deletePost.php?id=${post.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log(`Réponse du serveur : ${response.status}`);
            
            if (response.ok) {
                alert('Post supprimé avec succès');
                // Mettez à jour l'interface utilisateur pour supprimer le post visuellement
            } else {
                const errorResponse = await response.json();
                console.error(`Erreur lors de la suppression du post : ${errorResponse.message}`);
                alert('Erreur lors de la suppression du post');
            }
        } catch (error) {
            console.error('Une erreur est survenue :', error);
            alert('Une erreur est survenue');
        }
    }
    window.location.reload();
};
