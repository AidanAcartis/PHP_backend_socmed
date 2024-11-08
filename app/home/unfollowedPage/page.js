/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Card from "../../components/forPages/Cards.js";
import Layout from "../../components/forPages/PageLayout.js";
import { getUserProfile } from '../../components/forOtherUser/newComponents/otherUserName.js';
import { getUserProfilePhoto } from '../../components/forOtherUser/newComponents/otherProfilePhoto.js';
import FollowedUserNameClient from '../../components/forOtherUser/newComponents/otherUserNameClient.js';
import GetAboutMeForm from '../../api/about/getAboutMe.js';

const tabClasses = 'flex gap-1 md:px-3 py-1 items-center border-b-4 border-b-white cursor-pointer';
const activeTabClasses = 'flex gap-1 md:px-3 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold cursor-pointer';

  export default function FollowedPage() {

    const [Loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const [userId, setUserId] = useState(null);
    const [FollowerUserId, setFollowerUserId] = useState(null);

    const router = useRouter();

    // Récupérer l'ID depuis l'URL
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('userId');

      if (id) {
          setUserId(Number(id)); // Convertir l'ID en nombre
      } else {
          console.error("userId est undefined");
          setLoading(false);
          return;
      }
  }, []);
    
    console.log("userId de la personne pour cette page:", userId);
    const AboutId = userId;

    // Function to fetch user ID from userId.txt
    const fetchUserId = async () => {
      try {
          const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
          const userIdFromFile = await response.text();
          setFollowerUserId(userIdFromFile.trim());
      } catch (error) {
          console.error("Error fetching user ID:", error);
      }
  };

  useEffect(() => {
      fetchUserId(); // Fetch user ID when component mounts
  }, []);

  const [username, setUsername] = useState(null); 

   // Utiliser useEffect pour effectuer des appels asynchrones après que userId ait été défini
   useEffect(() => {
    const fetchUsername = async () => {
        try {
            if (userId !== null) { // Vérifiez que userId est défini
                const username = await getUserProfile(userId);
                console.log("Nom d'utilisateur récupéré :", username);
                setUsername(username);
            }
        } catch (error) {
            console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
        }
    };

    fetchUsername();
}, [userId]); // Ajoutez userId comme dépendance pour que ce useEffect se déclenche quand userId change

      const [avatarUrl, setAvatarUrl] = useState('');
      useEffect(() => {
              const fetchAvatar = async () => {
                try {
                    if (userId !== null) {
                      const avatarUrl = await getUserProfilePhoto(userId);
                      console.log("Url du photo de profile recupere :", avatarUrl);
                      setAvatarUrl(avatarUrl);
                      return;
                  }
                } catch (error) {
                  console.error("Erreur lors de la récupération du nom d'utilisateur :", error);
              }
        };

        fetchAvatar();
      }, [userId]);

    const [coverUrl, setCoverUrl] = useState('');
    useEffect(() => {
      const fetchCoverPhoto = async () => {
          try {
              const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/cover_photo.json');
              console.log("Réponse de la requête fetch:", response);
              const data = await response.json();
        
              // Recherche de la photo de couverture de l'utilisateur connecté
              const userCover = data.find(photo => Number(photo.user_id) === userId);
              console.log("URL de la photo de couverture:", userCover);
              if (userCover) {
                  setCoverUrl(userCover.photo_path);
              } else {
                  console.log("Aucune photo de couverture trouvée pour l'utilisateur.");
              }
          } catch (error) {
              console.error("Erreur lors de la récupération de la photo de couverture :", error);
          }
      };

      if (userId) {
          fetchCoverPhoto();
      }
  }, [userId]);

      // Fonction pour gérer le clic sur le bouton "Unfollow"
      const handleFollow = async (followedId) => {
        const Id = followedId;
        try {
          await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/follow.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include', 
            body: JSON.stringify({ follower_id: FollowerUserId, followed_id: followedId }),
          });
          console.log("follower_id :", FollowerUserId);
          console.log("followed_id :", followedId);
          router.push(`/home/followedPage?userId=${Id}`);
        } catch (error) {
          console.error("Erreur lors du désabonnement de l'utilisateur :", error);
        }
      };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    window.history.pushState(null, '', `/home/profile/${tab}?userId=${userId}`);
  };

  return (
    <Layout>
      <Card noPadding={true}>
        <div className="relative overflow-hidden rounded-md">
            <div className="h-56 overflow-hidden flex justify-center items-start relative">
                <div>
                  <img src={coverUrl || "https://static.zerochan.net/Anteater.Team.full.2361473.jpg"} alt="cover image" />
                </div>
            </div>
          <div className="relative">
            <div className="absolute bottom-2 top-0 left-6">
              <div className='w-12 md:w-24 relative'>
                  <div className="rounded-full overflow-hidden">
                      <img 
                          src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                          alt="avatar" 
                      />
                  </div>
              </div>
            </div>
            <div className="p-4 pt-0 md:pt-4 pb-8">
              <div className="ml-24 md:ml-40">
                 {/* Passez le nom d'utilisateur récupéré au composant client */}
                 {username ? <FollowedUserNameClient initialUsername={username} /> : 'Chargement...'}
                <div className="text-gray-500 leading-1 text-sm">
                  <GetMyLocation userId={AboutId} />
                </div>
                <div>
                    <button
                      className="text-gray-800 font-medium text-sm hover:text-blue-500 focus:outline-none"
                      onClick={() => handleFollow(userId)}
                    >
                      follow
                    </button>
                </div>
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

      <div className="flex justify-center items-center mt-8 bg-gray-100">
        <p className="text-center text-xl font-normal p-6 bg-white shadow-md rounded-lg">
          👋 Welcome to 
          {username ? <FollowedUserNameClient initialUsername={username} /> : 'Chargement...'}
          's profile! Click on the 'About' link to see her bio. 
          🚀 Follow her if you want to see her posts. 👍✨
        </p>
      </div>

      {/* Render components conditionally based on the active tab */}
      {activeTab === 'about' && (
        <div>
          <Card>
            <h2 className="font-bold text-3xl mb-2">About Section</h2>
             <GetAboutMeForm userId={AboutId} />
          </Card>
        </div>
      )}
    </Layout>
  );
}
