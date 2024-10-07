"use client"; // Ajoute cette directive pour indiquer que c'est un composant Client

import { useParams } from 'next/navigation'; 
import Home from '../page';

export default function HomePage() {
  const { home } = useParams(); // Récupère les segments dynamiques de l'URL

  if (!home) {
    // Si pages n'existe pas, affiche la page d'accueil
    return <Home />;
  }

  return <Home home={home} />; // Sinon, affiche la page correspondante
}
