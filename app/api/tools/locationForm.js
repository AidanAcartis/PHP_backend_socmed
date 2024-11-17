import React, { useState } from 'react';
import Card from '../../components/forPages/Cards';
import io from 'socket.io-client';


const socket = io('http://localhost:3003'); // Connect to your server

const Formulaire = ({ userId }) => {
  
  // Exemple de liste de postes
  const posts = [
    { id: 1, name: 'Chef de département' },
    { id: 2, name: 'Directeur' },
    { id: 3, name: 'Responsable RH' },
    { id: 4, name: 'Sécurité' },
    // Ajouter d'autres postes selon le besoin
  ];

  const getUserLocation = async (lieu) => {
    // Encoder le lieu pour éviter les espaces ou caractères spéciaux
    const encodedLieu = encodeURIComponent(lieu);

    // Construire l'URL de recherche sur Google Maps
    const url = `https://www.google.com/maps/search/${encodedLieu}`;

    // Ouvrir l'URL dans un nouvel onglet
    window.open(url, '_blank');
    
};

// Exemple d'utilisation : rechercher "Antananarivo" et envoyer l'URL au backend
getUserLocation("Andoharanofotsy");


  return (
    <div>
      <Card>
              <div>
                    <button type="button" onClick={getUserLocation}>
                           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                            </svg>
                            <span className="hidden md:block">Check in</span>
                    </button>
              </div>
              
          
      </Card>
    </div>
  );
};

export default Formulaire;
