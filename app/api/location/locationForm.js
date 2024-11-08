// AboutMeForm.js
import React, { useState } from 'react';
import Card from '../../components/forPages/Cards';

const MyLocation = ({ userId }) => {
  // Déclaration des états pour le pays et la ville
  const [aboutCountry, setAboutCountry] = useState('');
  const [aboutCity, setAboutCity] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();  // Empêche le rechargement de la page au soumettre

    try {
        const bodyData = {
            country: aboutCountry,  // Associe le pays avec la variable d'état
            city: aboutCity,        // Associe la ville avec la variable d'état
            user_id: userId         // Inclut l'ID de l'utilisateur
        };

        console.log("Données à envoyer :", bodyData); // Affiche les données envoyées pour débogage

        const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/location/location.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(bodyData),
        });

        // Traitez la réponse si nécessaire, par exemple :
        if (response.ok) {
            console.log("Soumission réussie");
        } else {
            console.log("Erreur lors de la soumission");
        }
        setAboutCountry('');
        setAboutCity('');

    } catch (error) {
        console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <div>
      <Card>
        <h2 className="font-semibold text-3sm mb-2">I'm from</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <h2 className="font-normal text-3sm mb-2">Country :</h2>
            <textarea
            className="w-full p-3 h-12 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black grow"
            placeholder="Écrivez votre pays ici..."
            value={aboutCountry}
            onChange={(e) => setAboutCountry(e.target.value)}
          />
            </div>
            <div>
            <h2 className="font-normal text-3sm mb-2">City :</h2>
            <textarea
            className="w-full p-3 h-12 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-black grow"
            placeholder="Écrivez votre ville ici..."
            value={aboutCity}
            onChange={(e) => setAboutCity(e.target.value)}
          />
            </div>
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

export default MyLocation;
