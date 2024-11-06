'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

function SearchComponent({ activeTab }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [userId, setUserId] = useState(''); // State to store the user ID
    const [noResults, setNoResults] = useState(false); // State to manage no results message

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
        } catch (error) {
            console.error('Erreur de récupération des résultats de recherche:', error);
        }
    };

    const handleFollow = async (followedId) => {
        try {
            await fetch('http://localhost/.../follow.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ follower_id: userId, followed_id: followedId }),
            });
            // Mettre à jour le statut de suivi dans `results` si nécessaire
        } catch (error) {
            console.error("Erreur lors du suivi de l'utilisateur :", error);
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
                                <a href={`/home/profile/about?userId=${user.id}`}>
                                    <div className="rounded-full overflow-hidden w-12 h-12">
                                        <img src={user.photo_path || '/default-avatar.png'} alt="Avatar" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="font-semibold">{user.username}</span>
                                        {/* Assuming 'canViewProfile' is a property to determine profile visibility*/}
                                    </div>
                                </a>
                                {user.canViewProfile ? (
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
