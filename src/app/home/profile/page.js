/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Avatar from "../../components/forPages/Avatar.js";
import Card from "../../components/forPages/Cards.js";
import Layout from "../../components/forPages/PageLayout.js";
import PostCard from "../../components/forPages/PostCard.js";
import ListOfFriend from '../../components/forProfile/ListOfFriends.js';
import Photos from '../../components/forProfile/Photos.js';
import { ServerFetchUsername } from '../../components/ServerFetchUsername.js';
import UserNameClient from '../../components/forIdentity/UserNameClient.js';


const tabClasses = 'flex gap-1 md:px-3 py-1 items-center border-b-4 border-b-white cursor-pointer';
const activeTabClasses = 'flex gap-1 md:px-3 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold cursor-pointer';

export default function ProfilePage() {
  const pathname = usePathname(); // Récupérer l'URL actuelle
  const [activeTab, setActiveTab] = useState('posts');

  const [username, setUsername] = useState(null);

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
    if (['posts', 'about', 'friends', 'photos'].includes(currentPath)) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('posts');
    }
  }, [pathname]); // Le useEffect se déclenche chaque fois que pathname change

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/home/profile/${tab}`);
  };

  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          <div className="h-56 overflow-hidden flex justify-center items-start">
            <img src="https://static.zerochan.net/Anteater.Team.full.2361473.jpg" alt="cover image"/>
          </div>
          <div className="relative">
            <div className="absolute bottom-2 top-0 left-6">
              <Avatar size={'lg'} />
            </div>
            <div className="p-4 pt-0 md:pt-4 pb-8">
              <div className="ml-24 md:ml-40">
                 {/* Passez le nom d'utilisateur récupéré au composant client */}
                 {username ? <UserNameClient initialUsername={username} /> : 'Chargement...'}
                <div className="text-gray-500 leading-1 text-sm">Himeji, Japan</div>
              </div>
              <div className="mt-4 md:mt-10 flex gap-5 text-sm">
                <button onClick={() => handleTabChange('posts')} className={activeTab === 'posts' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                  </svg>
                  <span className="hidden sm:block">Posts</span>
                </button>
                <button onClick={() => handleTabChange('about')} className={activeTab === 'about' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span className="hidden sm:block">About</span>
                </button>
                <button onClick={() => handleTabChange('friends')} className={activeTab === 'friends' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                  <span className="hidden sm:block">Friends</span>
                </button>
                <button onClick={() => handleTabChange('photos')} className={activeTab === 'photos' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
                  </svg>
                  <span className="hidden sm:block">Photos</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Render components conditionally based on the active tab */}
      {activeTab === 'posts' && (
        <div>
          <PostCard />
        </div>
      )}
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="font-bold text-3xl mb-2">About Section</h2>
              <p className="mb-2 text-sm">Miaou ! Je suis Nekota Tsutomu, mais tout le monde m&apos;appelle Nekonya. Avec mes longues mèches blondes et mes oreilles de chat perchées sur ma tête, on me remarque facilement. Qu&apos;est-ce que je fais de mes journées ? Eh bien, je suis une NEET fière de l&apos;être ! Les responsabilités, ce n&apos;est pas trop mon truc... je préfère largement passer des heures plongée dans mes jeux vidéo, où je suis une vraie pro. Le monde réel est si ennuyeux comparé à l&apos;univers virtuel, tu ne trouves pas ?</p>
              <p className="mb-2 text-sm">Je suis peut-être un peu bizarre aux yeux des autres, mais j&apos;assume totalement. Les tanks et les batailles, ça peut être intéressant, mais donne-moi une manette et je te montre ce que c&apos;est d&apos;être une véritable gamer. Mon style est unique, et mes passions le sont aussi. Tu ne me verras jamais sans mes oreilles de chat, elles sont mon emblème, ma signature. Nyaa !</p>
          </Card>
        </div>
      )}
      {activeTab === 'friends' && (
        <div>
          <Card className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
            <h2 className="font-bold text-3xl mb-2">Friends</h2>
            <ListOfFriend />
          </Card>
        </div>
      )}
      {activeTab === 'photos' && (
        <div>
          <Card className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
            <Photos />
          </Card>
        </div>
      )}
    </Layout>
  );
}
