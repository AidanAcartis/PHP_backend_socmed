import React, { useState, useEffect } from 'react';

const GetMyLocation = ({ userId }) => {
  const [aboutCountry, setAboutCountry] = useState(null);
  const [aboutCity, setAboutCity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getMyLocation = async () => {
      try {
        console.log("Appel API avec userId :", userId);

        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/location/getLocation.php', {
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
          // Vérifier si les données filtrées existent
          const filteredData = data.data.find(item => Number(item.user_id) === Number(userId));
          console.log("Données filtrées :", filteredData);

          if (filteredData) {
            setAboutCountry(filteredData.country);
            setAboutCity(filteredData.city);
          } else {
            setError('Aucune donnée trouvée pour cet utilisateur');
          }
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
      getMyLocation();
    }
  }, [userId]);

  return (
    <div>
      {loading ? (
        <p>Chargement...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>Erreur : {error}</p>
      ) : aboutCountry && aboutCity ? (
        <p>{aboutCity}, {aboutCountry}</p>
      ) : (
        <p>Aucune description trouvée pour cet utilisateur.</p>
      )}
    </div>
  );
};

export default GetMyLocation;
