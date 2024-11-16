import React, { useState } from 'react';
import Card from '../../components/forPages/Cards';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Connect to your server

const Formulaire = ({ userId }) => {
  // Déclaration des états
  const [aboutDate, setAboutDate] = useState('');
  const [aboutHour, setAboutHour] = useState('');
  const [aboutLocation, setAboutLocation] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [signature, setSignature] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [receiverPost, setReceiverPost] = useState(''); // Nouveau champ pour le poste du récepteur

  // Exemple de liste de postes
  const posts = [
    { id: 1, name: 'Chef de département' },
    { id: 2, name: 'Directeur' },
    { id: 3, name: 'Responsable RH' },
    { id: 4, name: 'Sécurité' },
    // Ajouter d'autres postes selon le besoin
  ];

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]);
  };

  const handlePostSelection = (e) => {
    const selectedPost = e.target.value;
    setReceiverPost(selectedPost);

    // Mettez à jour l'ID du récepteur en fonction du poste sélectionné
    const selectedPostObj = posts.find(post => post.name === selectedPost);
    if (selectedPostObj) {
      setReceiverId(selectedPostObj.id);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bodyData = {
        full_name: fullName,
        date: aboutDate,
        hour: aboutHour,
        location: aboutLocation,
        description: aboutDescription,
        user_id: userId,
        receiver_id: receiverId,
      };

      console.log("Données à envoyer :", bodyData);

      // Envoyer les données via WebSocket
      socket.emit('new_report', bodyData);

      const formData = new FormData();
      formData.append('data', JSON.stringify(bodyData));
      if (file) formData.append('file', file);
      if (signature) formData.append('signature', signature);

      const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/formulaire_de_signalement.php', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        console.log("Soumission réussie");
      } else {
        console.log("Erreur lors de la soumission");
      }

      // Réinitialiser les états après soumission
      setAboutDate('');
      setAboutHour('');
      setAboutLocation('');
      setAboutDescription('');
      setFile(null);
      setSignature(null);
      setFullName('');
      setReceiverPost(''); // Réinitialiser le poste du récepteur
      setReceiverId(''); // Réinitialiser l'ID du récepteur

    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  return (
    <div>
      <Card>
        <h2 className="font-semibold text-3sm mb-2">Formulaire de signalement</h2>
        <form onSubmit={handleSubmit}>
          {/* Champ Nom Complet */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Nom Complet :</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Entrez votre nom complet"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          {/* Champ Date */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Date :</label>
            <input
              type="date"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={aboutDate}
              onChange={(e) => setAboutDate(e.target.value)}
              required
            />
          </div>

          {/* Champ Heure */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Heure :</label>
            <input
              type="time"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={aboutHour}
              onChange={(e) => setAboutHour(e.target.value)}
              required
            />
          </div>

          {/* Champ Lieu */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Lieu :</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Entrez le lieu"
              value={aboutLocation}
              onChange={(e) => setAboutLocation(e.target.value)}
              required
            />
          </div>

          {/* Champ Description */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Description :</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Décrivez la situation"
              value={aboutDescription}
              onChange={(e) => setAboutDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Sélection du récepteur (poste) */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Sélectionner un récepteur :</label>
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              value={receiverPost}
              onChange={handlePostSelection}
              required
            >
              <option value="">Sélectionnez un poste</option>
              {posts.map(post => (
                <option key={post.id} value={post.name}>
                  {post.name}
                </option>
              ))}
            </select>
          </div>

          {/* Champ Fichier */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Ajouter un fichier (vidéo, PDF, audio) :</label>
            <input
              type="file"
              accept=".pdf, .mp4, .mp3"
              onChange={handleFileChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Télécharger votre signature :</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleSignatureChange}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div className="flex justify-between mb-4">
            <button type="button" className=" text-black p-2 rounded" onClick={() => alert('Fonctionnalité vidéo non implémentée')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
              Faire une vidéo
            </button>
            <button type="button" className=" text-black p-2 rounded" onClick={() => alert('Fonctionnalité audio non implémentée')}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 1 1 6 0v8.25a3 3 0 0 1-3 3Z" />
              </svg>
              Enregistrement audio
            </button>
          </div>
          <div className="flex justify-between mb-4">
            <button type="submit" className="bg-[#AAB396] p-2 rounded-full text-white hover:bg-[#8f9275]">Envoyer</button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Formulaire;
