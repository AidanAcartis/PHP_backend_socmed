/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Avatar from "../../components/forPages/Avatar.js";
import Card from "../../components/forPages/Cards.js";
import PostCard from "../../components/forPages/PostCard.js";
import ListOfFriend from '../../components/forProfile/ListOfFriends.js';
import Photos from '../../components/forProfile/Photos.js';
import { ServerFetchUsername } from '../../components/ServerFetchUsername.js';
import UserNameClient from '../../components/forIdentity/UserNameClient.js';
import Cover from '../../components/forPages/Cover.js';
import SearchComponent from '../../components/forSearch/SearchComponent.js';
import GetAboutMeForm from '../../api/about/getAboutMe.js';
import GetMyLocation from '../../api/location/getMyLocation.js';
import Header from '../../components/NewFolderComponent/header.js';
import PageLayout from '../../components/NewFolderComponent/userNavigation/newPageLayout.js';
import Layout from '../../components/forPages/PageLayout.js';
import VideoCapture from '../../api/IA/VideoIa.jsx';
import StatusForUser from '../../components/NewFolderComponent/dashboard/SimpleUtilisateur/signalementStatus.js';


const tabClasses = 'flex gap-1 md:px-3 py-1 items-center border-b-4 border-b-white cursor-pointer';
const activeTabClasses = 'flex gap-1 md:px-3 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold cursor-pointer';

export default function ProfilePage() {
  const pathname = usePathname(); // Récupérer l'URL actuelle
  const [activeTab, setActiveTab] = useState('statuts');
  {/*const userId = router.query.id;
      const isMyUser = userId === session?.user?.id;
      const session = useSession();
    */}

  const [username, setUsername] = useState(null); 
  const [userId, setUserId] = useState(null);
    // Function to fetch user ID from userId.txt
    const fetchUserId = async () => {
      try {
          const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
          const userIdFromFile = await response.text();
          setUserId(userIdFromFile.trim());
      } catch (error) {
          console.error("Error fetching user ID:", error);
      }
  };

  useEffect(() => {
      fetchUserId(); // Fetch user ID when component mounts
  }, []);

    // Utiliser useEffect pour effectuer des appels asynchrones après le rendu
    useEffect(() => {
        const fetchUsername = async () => {
          try {
            const username = await ServerFetchUsername();
            console.log("Nom d'utilisateur récupéré :", username);
            setUsername(username);
          } catch (error) {
            console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
          }
        };
        fetchUsername();
      }, []);

  useEffect(() => {
    const currentPath = pathname.split('/').pop(); 
    if (['status', 'Activités', 'suggestions', 'contacts', 'agenda'].includes(currentPath)) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('status');
    }
  }, [pathname]); // Le useEffect se déclenche chaque fois que pathname change

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/home/patientProfile/${tab}`);
  };

  return (
    <div>
      <Header />
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          <Cover />
          <div className="relative">
            <div className="absolute bottom-2 top-0 left-6">
              <Avatar size={'lg'} />
            </div>
            <div className="p-4 pt-0 md:pt-4 pb-8">
              <div className="ml-24 md:ml-40">
                 {/* Passez le nom d'utilisateur récupéré au composant client */}
                 {username ? <UserNameClient initialUsername={username} /> : 'Chargement...'}
                <div className="text-gray-500 leading-1 text-sm">
                  <GetMyLocation userId={userId}/>
                </div>
              </div>
              <div className="mt-4 md:mt-10 flex gap-5 text-sm">
                <button onClick={() => handleTabChange('status')} className={activeTab === 'status' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="hidden sm:block">Status</span>
                </button>
                <button onClick={() => handleTabChange('agenda')} className={activeTab === 'agenda' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                  </svg>
                  <span className="hidden sm:block">Agenda</span>
                </button>
                <button onClick={() => handleTabChange('Activités')} className={activeTab === 'Activités' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span className="hidden sm:block">Activité</span>
                </button>
                <button onClick={() => handleTabChange('contacts')} className={activeTab === 'contacts' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <span className="hidden sm:block">Contacts</span>
                </button>
                <button onClick={() => handleTabChange('suggestions')} className={activeTab === 'suggestions' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  <span className="hidden sm:block">Suggestions</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Render components conditionally based on the active tab */}
      {activeTab === 'status' && (
        <div>
            <StatusForUser />
          {/* <VideoCapture />*/}
         
        </div>
      )}
      {activeTab === 'agenda' && (
        <div>
          <Card>
            <h2 className="font-bold text-3xl mb-2">Agenda</h2>
              
          </Card>
        </div>
      )}
      {activeTab === 'Activités' && (
        <div>
          <Card>
            <h2 className="font-bold text-3xl mb-2">About Me</h2>
              <GetAboutMeForm userId={userId} />
          </Card>
        </div>
      )}
      {activeTab === 'contacts' && (
        <div>
          <Card className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
            <h2 className="font-bold text-3xl mb-2">Friends</h2>
            <SearchComponent activeTab={activeTab} />
            <ListOfFriend />
          </Card>
        </div>
      )}
      {activeTab === 'suggestions' && (
        <div>
          <Card className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
            <Photos />
          </Card>
        </div>
      )}
    </Layout>
    </div>
  );
}
