/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Card from "../../components/forPages/Cards.js";
import Layout from "../../components/forPages/PageLayout.js";
import ListOfFriend from '../../components/forProfile/ListOfFriends.js';
import UserNameClient from '../../components/forIdentity/UserNameClient.js';
import { getUserProfile } from '../../components/forOtherUser/newComponents/otherUserName.js';
import OtherCover from '../../components/forOtherUser/newComponents/otherCover.js';
import OtherProfilePhoto from '../../components/forOtherUser/newComponents/otherProfilePhoto.js';


const tabClasses = 'flex gap-1 md:px-3 py-1 items-center border-b-4 border-b-white cursor-pointer';
const activeTabClasses = 'flex gap-1 md:px-3 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold cursor-pointer';

export default function unfollowedPage({ userId }) {
  const pathname = usePathname(); // Récupérer l'URL actuelle 
  const [activeTab, setActiveTab] = useState('posts');
  {/*const userId = router.query.id;
      const isMyUser = userId === session?.user?.id;
      const session = useSession();
    */}

  const [username, setUsername] = useState(null); 

    // Utiliser useEffect pour effectuer des appels asynchrones après le rendu
    useEffect(() => {
        const fetchUsername = async () => {
          try {
            const username = await getUserProfile(userId);
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
    if (['posts', 'about', 'photos'].includes(currentPath)) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('posts');
    }
  }, [pathname]); // Le useEffect se déclenche chaque fois que pathname change

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/home/profile/${tab}?userId=${userId}`);
  };

  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
          {/*<Cover url={profile?.cover editable=isMyUser}/>
            <div className="h-56 overflow-hidden flex justify-center items-start">
            <img src="https://static.zerochan.net/Anteater.Team.full.2361473.jpg" alt="cover image"/>
          </div>
          <Cover />
          */}
          <OtherCover userId={userId} />
          <div className="relative">
            <div className="absolute bottom-2 top-0 left-6">
              <OtherProfilePhoto size="lg" userId={userId} />
            </div>
            <div className="p-4 pt-0 md:pt-4 pb-8">
              <div className="ml-24 md:ml-40">
                 {/* Passez le nom d'utilisateur récupéré au composant client */}
                 {username ? <UserNameClient initialUsername={username} /> : 'Chargement...'}
                <div className="text-gray-500 leading-1 text-sm">Himeji, Japan</div>
              </div>
              <div className="mt-4 md:mt-10 flex gap-5 text-sm">
                <button onClick={() => handleTabChange('about')} className={activeTab === 'about' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                  <span className="hidden sm:block">About</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Render components conditionally based on the active tab */}
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="font-bold text-3xl mb-2">About Section</h2>
              <p className="mb-2 text-sm">Miaou ! Je suis Nekota Tsutomu, mais tout le monde m&apos;appelle Nekonya. Avec mes longues mèches blondes et mes oreilles de chat perchées sur ma tête, on me remarque facilement. Qu&apos;est-ce que je fais de mes journées ? Eh bien, je suis une NEET fière de l&apos;être ! Les responsabilités, ce n&apos;est pas trop mon truc... je préfère largement passer des heures plongée dans mes jeux vidéo, où je suis une vraie pro. Le monde réel est si ennuyeux comparé à l&apos;univers virtuel, tu ne trouves pas ?</p>
              <p className="mb-2 text-sm">Je suis peut-être un peu bizarre aux yeux des autres, mais j&apos;assume totalement. Les tanks et les batailles, ça peut être intéressant, mais donne-moi une manette et je te montre ce que c&apos;est d&apos;être une véritable gamer. Mon style est unique, et mes passions le sont aussi. Tu ne me verras jamais sans mes oreilles de chat, elles sont mon emblème, ma signature. Nyaa !</p>
          </Card>
        </div>
      )}
    </Layout>
  );
}
