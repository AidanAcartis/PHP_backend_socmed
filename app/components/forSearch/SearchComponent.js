'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import from 'next/navigation'

function SearchComponent({ activeTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userId, setUserId] = useState(''); // State to store the user ID
    const [noResults, setNoResults] = useState(false); // State to manage no results message
    const [isFollowing, setIsFollowing] = useState(false);
    const [followingStatus, setFollowingStatus] = useState({}); 
   
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

            // Vérification du statut de suivi pour chaque utilisateur dans les résultats
            const status = {};
            for (const user of data) {
                const followResponse = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/followers/check_follow_status.php?userId=${user.id}`, {
                    credentials: 'include',
                });
                const followData = await followResponse.json();
                status[user.id] = followData.isFollowing;
            }
            setFollowingStatus(status);

        } catch (error) {
            console.error('Erreur de récupération des résultats de recherche:', error);
        }
        
    };

    const handleFollow = async (followedId) => {
        try {
            await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/follow.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', 
                body: JSON.stringify({ follower_id: userId, followed_id: followedId }),
            });
            // Mise à jour de l'état de suivi pour cet utilisateur
            setFollowingStatus(prevStatus => ({
                ...prevStatus,
                [followedId]: true
            }));
        } catch (error) {
            console.error("Erreur lors du suivi de l'utilisateur :", error);
        }
        window.location.reload();
    };

     // Fonction pour gérer le clic sur le bouton "Unfollow"
  const handleUnFollow = async (followedId) => {
    try {
      await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/unfollow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ follower_id: userId, followed_id: followedId }),
      });
      // Mise à jour de l'état de suivi pour cet utilisateur
      setFollowingStatus(prevStatus => ({
        ...prevStatus,
        [followedId]: false
    }));
    } catch (error) {
      console.error("Erreur lors du désabonnement de l'utilisateur :", error);
    }
    window.location.reload();
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

    return (
        <div>
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
                                     onClick={() => followingStatus[user.id] ? handleUnFollow(user.id) : handleFollow(user.id)}
                                    >
                                        {followingStatus[user.id] ? 'Unfollow' : 'Follow'}
                                    </button>
                                </div>
                                {followingStatus[user.id] ? (
                                            <p className="text-sm text-green-600">Profil visible</p>
                                        ) : (
                                            <p className="text-sm text-red-600">Accès restreint</p>
                                        )}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>

    );
}

export default SearchComponent;
