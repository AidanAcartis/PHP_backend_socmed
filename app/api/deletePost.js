export default async function handler(req, res) {
    if (req.method === 'DELETE') {
      const { id } = req.query;
  
      try {
        // Appel du script PHP pour supprimer le post
        const response = await fetch(`http://your-server-domain/delete_post.php?id=${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          const data = await response.json();
          res.status(200).json(data); // Retourne la réponse du PHP
        } else {
          res.status(500).json({ message: 'Erreur lors de la suppression du post' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'appel du backend PHP' });
      }
    } else {
      res.status(405).json({ message: 'Méthode non autorisée' });
    }
  }