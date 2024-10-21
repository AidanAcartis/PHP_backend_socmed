"use client"; // Indique que le code est côté client

import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Utilisez useRouter de Next.js

export default function LogoutPage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleLogout = async () => {
    setError(null); // Réinitialiser l'erreur

    try {
      // Appel à l'API pour déconnecter l'utilisateur et supprimer les données
      const response = await fetch('http://localhost/Devoi_socila_media/src/backend/controllers/users/logout.php', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        console.log("Déconnexion réussie");
        // Supprimer les informations de l'utilisateur dans le stockage local
        sessionStorage.removeItem('userId');
        // Rediriger vers la page de connexion
        router.push('/login'); // Utilisez router.push pour rediriger
      } else {
        const data = await response.json();
        setError(data.message || "Échec de la déconnexion");
      }
    } catch (error) {
      setError(error.message); // Définir l'erreur si une exception est levée
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-xl font-bold mb-4 text-center">Se déconnecter</h2>
        
        {error && <p className="text-red-500">{error}</p>} {/* Afficher l'erreur */}
        
        <p className="mb-4">Êtes-vous sûr de vouloir vous déconnecter ?</p>
        <button
          onClick={handleLogout}
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
