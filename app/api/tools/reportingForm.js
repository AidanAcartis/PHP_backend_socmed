'use client';

import React, { useEffect, useRef, useState } from 'react';
import Card from '../../components/forPages/Cards';
import io from 'socket.io-client';
import { useRouter } from 'next/navigation';
import UploadForm from '../../components/upload/uploadForm';
import { usePostActions } from '../../components/forPages/createPosts/actions';
import VideoCapture from '../../components/NewFolderComponent/video_audio/videoCapture';
import AudioCapture from '../../components/NewFolderComponent/video_audio/audioCapture';

const socket = io('http://localhost:3003'); // Connect to your server

const Formulaire = ({ activeTab }) => {
  // Déclaration des états
  const [aboutDate, setAboutDate] = useState('');
  const [aboutHour, setAboutHour] = useState('');
  const [aboutLocation, setAboutLocation] = useState('');
  const [aboutDescription, setAboutDescription] = useState('');
  const [file, setFile] = useState(null);
  const [fullName, setFullName] = useState('');
  const [signature, setSignature] = useState(null);
  const [receiverId, setReceiverId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userId, setUserId] = useState(''); // State to store the user ID
    const [noResults, setNoResults] = useState(false); // State to manage no results messag
    const { postText, setPostText, handleShare, loading } = usePostActions();
    const [showUpload, setShowUpload] = useState(false);
    const inputRef = useRef(null); 
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileUserId, setFileUserId] = useState(null);
   
    const router = useRouter(); // Initialize useRouter for navigation

    // Function to fetch user ID from 'userId.txt'
    const fetchUserId = async () => {
        try {
            console.log("Début de la récupération de l'ID utilisateur...");
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            console.log("Statut de la réponse de l'ID utilisateur :", response.status);
            if (!response.ok) {
                throw new Error("Erreur de la réponse lors de la récupération de l'ID utilisateur");
            }
            const userIdFromFile = await response.text();
            console.log("ID utilisateur récupéré :", userIdFromFile.trim());
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

    // Use useEffect to call fetchUserId when the component mounts
    useEffect(() => {
        fetchUserId();
    }, []);

    // Function to handle selecting a user and setting receiverId
    const handleSelect = (id) => {
      setReceiverId(id);
      console.log(`Selected receiver ID: ${id}`);
    };

    // Function to handle search
    const handleSearch = async () => {
        try {
            if (!userId) {
                console.log("L'ID utilisateur n'est pas encore disponible.");
                return;
            }

            if (!searchQuery.trim()) {
                console.log("La zone de recherche est vide.");
                setResults([]);
                setNoResults(false);
                return; // Do not fetch if the search query is empty
            }

            console.log("ID utilisateur utilisé pour la recherche :", userId);
            console.log("Requête de recherche pour le nom d'utilisateur :", searchQuery);

            const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/search.php?username=${encodeURIComponent(searchQuery)}&userId=${userId}`, {
                credentials: 'include', // Allows cookies with CORS
            });

            console.log("Statut de la réponse de recherche :", response.status);
            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            console.log("Données récupérées de la recherche :", data);

            setResults(data);
            setNoResults(data.length === 0); // Set noResults if no users were found
        } catch (error) {
            console.error('Erreur de récupération des résultats de recherche:', error);
        }
        
    };

    // Nouvelle fonction pour vérifier le statut de suivi et rediriger
    const handleProfileClick = async (targetUserId) => {
        console.log("targetUserId:", targetUserId);
        try {
            const response = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/followers/check_follow_status.php?userId=${targetUserId}`, {
                credentials: 'include',
            });
            const data = await response.json();

            if (data.isFollowing) {
                router.push(`/home/followedPage?userId=${targetUserId}`);
            } else {
                router.push(`/home/unfollowedPage?userId=${targetUserId}`);
            }
        } catch (error) {
            console.error("Erreur lors de la vérification du statut de suivi :", error);
        }
    };

  const handleFileSelected = (file) => {
    setSelectedFile(file);
    setFileUserId(userId); // Utiliser l'userId déjà récupéré
    setFile(file);
    console.log("Fichier reçu dans PostFormCard:", file);
    console.log("userId reçu dans PostFormCard:", userId);
};

const handleShareClick = async () => {
    const formData = new FormData();
    formData.append("user_id", fileUserId || userId); // Utiliser fileUserId si disponible, sinon userId
    formData.append("content", postText); // Ajout du texte dans formData
    
    console.log("user_id:", fileUserId || userId);
    console.log("content:", postText);

    if (selectedFile) {
        formData.append("file", selectedFile);

        // Log pour afficher les données ajoutées à formData
        console.log("Contenu de formData avec fichier :");
        console.log("file:", selectedFile.name, "| Taille:", selectedFile.size, "| Type:", selectedFile.type);
        
        // Déterminer le dossier en fonction du type de fichier
        let folder;
        if (selectedFile.type.startsWith('image/')) {
            folder = 'photos';
        } else if (selectedFile.type.startsWith('application/pdf')) {
            folder = 'pdfs';
        } else if (selectedFile.type.startsWith('video/')) {
            folder = 'videos';
        } else {
            console.error('Type de fichier non supporté');
            return;
        }

        const docUrl = `http://localhost/Devoi_socila_media/public/documents/${folder}/${selectedFile.name}`;
    } else {
        formData.append("file", null);
        console.log("Aucun fichier sélectionné, envoi uniquement du texte.");
    }

    try {
        console.log("Début du fetch vers create_post.php...");
        const response = await fetch("http://localhost/Devoi_socila_media/src/backend/controllers/posts/createPost/create_post.php", {
            method: 'POST',
            credentials: 'include',
            body: formData
        });
        console.log("Fetch terminé, en attente de la réponse...");

        const responseText = await response.text();
        console.log("Réponse brute reçue :", responseText);

        try {
            const result = JSON.parse(responseText);
            console.log("Réponse JSON reçue :", result);
            alert(result.message);

            if (selectedFile) {
                const docType = selectedFile.type.startsWith('video/') ? 'video' : (selectedFile.type === 'application/pdf' ? 'pdf' : 'photo');
                //await createPost(result.message, docUrl, docType);
            }
        } catch (jsonError) {
            console.error("Erreur de parsing JSON :", jsonError);
            alert("Erreur de format dans la réponse du serveur.");
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi :", error);
        alert("Échec de l'envoi.");
    }

    setPostText(''); // Effacer le texte après un partage réussi
     //window.location.reload();
};


  const handleSignatureChange = (e) => {
    setSignature(e.target.files[0]);
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

  const handleLocationSearch = () => {
    if (aboutLocation) {
      const encodedLieu = encodeURIComponent(aboutLocation);
      const url = `https://www.google.com/maps/search/${encodedLieu}`;
      window.open(url, '_blank');
    } else {
      alert('Veuillez entrer un lieu valide.');
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
            <div>
              <label>Lieu :</label>
              <input
                type="text"
                value={aboutLocation}
                onChange={(e) => setAboutLocation(e.target.value)}
                placeholder="Entrez un lieu"
                className="border p-2"
              />
            </div>
            <button type="button" onClick={handleLocationSearch} className="bg-blue-500 text-white px-4 py-2 mt-2 rounded flex">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 mr-2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                  />
                </svg>
              Check in Google Maps
            </button>
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
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Sélectionner un récepteur :</label>
            <div className="flex items-center space-x-4 mb-6"> {/* Utilisez flexbox pour aligner les éléments sur la même ligne */}
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher un utilisateur..."
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-md" // Utilisez flex-grow pour faire en sorte que le champ occupe tout l'espace disponible
                />
                <button
                    className="bg-socialBlue text-white px-6 py-1 rounded-md" 
                    onClick={handleSearch}
                >
                    Rechercher
                </button>
            </div>

            <div className="mt-4"> {/* Add margin-top for additional spacing */}
                {noResults && <p>Aucun utilisateur trouvé.</p>} {/* Message if no results are found */}
                <ul className="flex flex-col space-y-2">
                    {results.map((user) => (
                        <li key={user.id} className="flex items-center space-x-2 border-b pb-2">
                            <div>
                                <div className="flex items-center space-x-20 mb-2">
                                    <a 
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleProfileClick(user.id);
                                        }}
                                    >
                                        <div className='flex items-center gap-3'> 
                                            <div className="rounded-full overflow-hidden w-12 h-12">
                                                <img src={user.photo_path || '/default-avatar.png'} alt="Avatar" className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex">
                                                <span className="font-semibold">{user.username}</span>
                                                {/* Assuming 'canViewProfile' is a property to determine profile visibility*/}
                                            </div>
                                        </div>
                                    </a>
                                    <button
                                     className="bg-socialBlue text-white px-2 py-1 rounded-md"
                                     onClick={() => handleSelect(user.id)}
                                    >
                                        Select
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
          </div>

          {/* Champ Fichier */}
          <div className="mb-4">
            <label className="font-normal text-3sm mb-2">Ajouter un fichier (vidéo, PDF, audio) :</label>
            <div className="flex gap-1">
                <div className="flex flex-col grow" ref={inputRef}>
                    <textarea
                        className="grow p-3 h-14"
                        placeholder="Entrer le titre de votre plainte"
                        value={postText}
                        onChange={(e) => setPostText(e.target.value)}
                        onClick={() => setShowUpload(true)}
                    />
                    {showUpload && <UploadForm onFileSelected={handleFileSelected} />}
                </div>
            </div>
            <div className="flex gap-5 mt-2 items-center">
                    <div className="grow text-right">
                        <button
                            className="bg-socialBlue text-white px-4 py-1 rounded-md"
                            onClick={handleShareClick}
                        >
                            Confirm
                        </button>
                    </div>
            </div>
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
              <VideoCapture />
              <AudioCapture />
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
