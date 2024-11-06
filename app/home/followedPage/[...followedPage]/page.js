"use client"; // Ajoute cette directive pour indiquer que c'est un composant Client

import { useParams } from 'next/navigation'; 
import FollowedPage from '../page';


export default function Profile() {
  const { profile } = useParams(); // Récupère les segments dynamiques de l'URL

  if (!profile) {
    return <div>Loading...</div>; // Gère les cas où la route n'est pas encore chargée
  }

  return <FollowedPage profile={profile} />; // Passe le profil au composant ProfilePage
}
