// deletePost.js

export const handleDeletePost = async (post) => {
  if (confirm("Voulez-vous vraiment supprimer ce post ?")) {
      try {
          const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/controllers/posts/deletePost/deletePost.php?id=${post.id}`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
          });

          if (response.ok) {
              alert('Post supprimé avec succès');
              // Mettez à jour l'interface utilisateur pour supprimer le post visuellement
          } else {
              alert('Erreur lors de la suppression du post');
          }
      } catch (error) {
          alert('Une erreur est survenue');
      }
      window.location.reload();
  }
};
