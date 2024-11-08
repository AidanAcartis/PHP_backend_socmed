// AboutMeForm.js
import React, { useState } from 'react';
import Card from '../../components/forPages/Cards';

const AboutMeForm = ({ userId }) => {
  // État pour stocker le texte soumis
  const [aboutText, setAboutText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page au soumettre

    try {
        const bodyData = {
            description: aboutText,  // Renommé 'content' en 'description'
            user_id: userId          // Renommé 'userId' en 'user_id'
        };        

        console.log("Données à envoyer :", bodyData); // Affiche les données envoyées pour débogage

        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/about/about.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(bodyData),
        });

        const responseText = await response.text(); // Récupérer la réponse sous forme de texte
        console.log("Contenu de la réponse :", responseText); // Vérifie ce qui est renvoyé

        console.log("Statut de la réponse :", response.status);
        console.log("Type de contenu de la réponse :", response.headers.get("content-type"));

        const data = JSON.parse(responseText); // Tente de parser la réponse manuellement
        console.log("Réponse du serveur :", data);

        if (response.ok) {
            console.log("Réponse du serveur :", data); // Affiche la réponse JSON du serveur
            setAboutText(''); // Effacer le texte après un partage réussi
        } else {
            console.error('Erreur du serveur : ', data.message); // Affiche le message d'erreur du serveur
        }
    } catch (error) {
        console.error('Erreur de connexion : ', error.message); // Affiche les erreurs de connexion
        setAboutText('');
    } 
    //window.location.reload();  // Enlevez cette ligne si vous ne voulez pas recharger la page
};
  return (
    <div>
      <Card>
        <h2 className="font-semibold text-3sm mb-2">About Me</h2>
        <form onSubmit={handleSubmit}>
          <textarea
            className="w-full p-3 h-48 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black grow"
            placeholder="Introduce yourself here..."
            value={aboutText}
            onChange={(e) => setAboutText(e.target.value)}
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-blue-500 text-white px-2 py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Submit
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AboutMeForm;
