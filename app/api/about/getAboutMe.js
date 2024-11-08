import React, { useState, useEffect } from 'react';
import Card from '../../components/forPages/Cards';

const GetAboutMeForm = ({ userId }) => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getAboutMe = async () => {
      try {
        console.log("Appel API avec userId :", userId);

        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/about/getAbout.php', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({ user_id: userId }),
        });

        const responseText = await response.text();
        console.log("Contenu de la réponse :", responseText);

        const data = JSON.parse(responseText);

        if (response.ok) {
          const filteredData = data.data.filter(item => Number(item.user_id) === Number(userId));
          console.log("Données filtrées :", filteredData);
          setAboutData(filteredData);
        } else {
          setError(data.message || 'Erreur inconnue');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      getAboutMe();
    }
  }, [userId]);

  return (
    <div>
      <Card>
        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>Erreur : {error}</p>
        ) : aboutData && aboutData.length > 0 ? (
          <p>{aboutData[0].description}</p>
        ) : (
          <p>Aucune description trouvée pour cet utilisateur.</p>
        )}
      </Card>
    </div>
  );
};

export default GetAboutMeForm;
