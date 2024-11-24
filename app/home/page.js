// pages/index.js
'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '../components/NewFolderComponent/header';
import QuickAccess from '../components/NewFolderComponent/Section/quickAccess';
import ResourceCenter from '../components/NewFolderComponent/Section/ressourceCenter';
import SupportSection from '../components/NewFolderComponent/Section/supportSection';
import Layout from '../components/forPages/PageLayout';

export default function HomePage() {
  const [userType, setUserType] = useState('');

  const fetchUserType = async () => {
    try {
      const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userType.txt');
      const userTypeFromFile = await response.text();
      setUserType(userTypeFromFile.trim()); // Utilisation de trim() pour enlever les espaces ou sauts de ligne
      console.log('userType:', userTypeFromFile);
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
      <Layout>
        <div className="container grid grid-cols-2 gap-4 mx-auto p-4">
          {(userType === 'utilisateur' || userType === 'securite') && (
            <>
                <Link href="/home/fonctionnality">
                  <QuickAccess />
                </Link>
            </>
          )}
          <Link href="/home/ressources">
            <ResourceCenter />
          </Link>
          <Link href="/home/forum">
            <SupportSection />
          </Link>
        </div>
      </Layout>
    </div>
  );
}
