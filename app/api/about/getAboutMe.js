// AboutMeForm.js
import React, { useState, useEffect } from 'react';
import Card from '../../components/forPages/Cards';

const GetAboutMeForm = ({ userId }) => {
  // État pour stocker les résultats récupérés
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);  // Pour gérer le chargement des données
  const [error, setError] = useState(null);      // Pour gérer les erreurs éventuelles

  // Fonction pour récupérer les données de "About Me"
  const getAboutMe = async () => {
    try {
      const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/about/getAbout.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }), // Envoyer l'userId dans la requête
      });

      const responseText = await response.text(); // Récupérer la réponse sous forme de texte
      console.log("Contenu de la réponse :", responseText); // Pour déboguer

      const data = JSON.parse(responseText); // Parser la réponse JSON

      if (response.ok) {
        // Filtrer les données pour ne garder que celles de l'utilisateur spécifié
        const filteredData = data.data.filter(item => item.user_id === userId);
        setAboutData(filteredData); // Stocker les données filtrées dans l'état
      } else {
        setError(data.message || 'Erreur inconnue'); // Gérer les erreurs
      }
    } catch (error) {
      setError(error.message); // Gérer les erreurs de connexion
    } finally {
      setLoading(false); // Marquer comme terminé le chargement des données
    }
  };

  // Utiliser useEffect pour appeler la fonction au moment du montage du composant
  useEffect(() => {
    getAboutMe();
  }, [userId]); // Recharger les données lorsque userId change

  return (
    <div>
      <Card>
        {loading ? (
          <p>Chargement...</p> // Afficher un message pendant le chargement
        ) : error ? (
          <p style={{ color: 'red' }}>Erreur : {error}</p> // Afficher l'erreur, si elle existe
        ) : aboutData && aboutData.length > 0 ? (
          <p>{aboutData[0].description}</p> // Afficher la description de l'utilisateur
        ) : (
          <p>Aucune description trouvée pour cet utilisateur.</p> // Si aucune donnée n'est trouvée
        )}
      </Card>
    </div>
  );
};

export default GetAboutMeForm;
