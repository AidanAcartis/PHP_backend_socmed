// Fonction pour récupérer un post spécifique à partir du fichier JSON
export async function ServerFetchCommentById(postId) {
    try {
        const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/posts/createPost/posts.json');
        if (!response.ok) {
            console.error('Erreur lors de la récupération des données du post:', response.statusText);
            return null;
        }
        const data = await response.json();

        // Filtrer les données pour trouver le post avec le postId spécifié
        const post = data.find(post => post.id === String(postId)); // Convertir postId en chaîne
        if (post) {
            console.log('Post id:', postId);
            console.log('Post trouvé:', post);
            return post;
        } else {
            console.log('Post id:', postId);
            console.log('Aucun post trouvé avec cet ID');
            return null;
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des données du post:', error);
        return null;
    }
}
