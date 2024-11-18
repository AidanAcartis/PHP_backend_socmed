// pages/index.js
'use client';
import { useEffect, useState } from 'react';
import Header from '../../components/NewFolderComponent/header';
import FonctNavigationCard from '../../components/NewFolderComponent/Navigation/userfonctNav';
import SecuFonctNavigationCard from '../../components/NewFolderComponent/Navigation/secufonctNav';


export default function FonctionnalityPage() {
  const [userType, setUserType] = useState('');

    const fetchUserType = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userType.txt');
            const userTypeFromFile = await response.text();
            setUserType(userTypeFromFile);
            console.log('userType:', userType);
        } catch (error) {
            console.error("Erreur lors de la récupération du type utilisateur :", error);
        }
    };

    useEffect(() => {
        fetchUserType();
    }, []);

  return (
    <div>
      <Header />
      <div className="container mx-auto p-4 items-center">
      {userType === 'securite' && (              
          <SecuFonctNavigationCard />
        )}
       {(userType === 'utilisateur' || userType === 'sante') && (
          <FonctNavigationCard />
       )}
      </div>
    </div>
  );
}
