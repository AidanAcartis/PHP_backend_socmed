/* eslint-disable @next/next/no-img-element */

"use client";

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Card from "../../components/forPages/Cards.js";
import Layout from "../../components/forPages/PageLayout.js";
import { getUserProfile } from '../../components/forOtherUser/newComponents/otherUserName.js';
import Link from 'next/link';
import { getUserProfilePhoto } from '../../components/forOtherUser/newComponents/otherProfilePhoto.js';
import { ServerFetchPost } from '../../components/ServerFetchPost.js';
import FollowedUserNameClient from '../../components/forOtherUser/newComponents/otherUserNameClient.js';
import OtherPostCard from '../../components/forOtherUser/newComponents/otherPostCard.js';
import OtherUserFiles from '../../components/forOtherUser/newComponents/otherPhoto.js';

const tabClasses = 'flex gap-1 md:px-3 py-1 items-center border-b-4 border-b-white cursor-pointer';
const activeTabClasses = 'flex gap-1 md:px-3 py-1 items-center border-socialBlue border-b-4 text-socialBlue font-bold cursor-pointer';

  export default function FollowedPage() {

    const [Loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('posts');
    const pathname = usePathname(); // Récupérer l'URL actuelle 
    const [userId, setUserId] = useState(null);
    const [FollowerUserId, setFollowerUserId] = useState(null);

    const [photos, setPhotos] = useState([]); // Pour stocker les photos
    const [videos, setVideos] = useState([]); // Pour stocker les vidéos
    const [pdfs, setPdfs] = useState([]); // Pour stocker les PDF

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

    useEffect(() => {
      const fetchUserFiles = async () => {
        try {
          const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/posts/createPost/userFile.json');
          if (!response.ok) {
            throw new Error("Erreur lors de la récupération des fichiers de l'utilisateur");
          }
          const data = await response.json();
  
          // Filtrer les fichiers selon le userId et séparer par type
          const userFiles = data.filter(file => Number(file.user_id) === userId);
          setPhotos(userFiles.filter(file => file.doc_type === 'photo'));
          setVideos(userFiles.filter(file => file.doc_type === 'video'));
          setPdfs(userFiles.filter(file => file.doc_type === 'pdf'));
        } catch (error) {
          console.error("Erreur lors du chargement des fichiers de l'utilisateur :", error);
        }
      };
  
      fetchUserFiles();
    }, [userId]);
  

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

  const [posts, setPosts] = useState([]);
  
    // Récupérer, trier et filtrer les posts
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await ServerFetchPost();
                console.log("Données des posts récupérées :", data);
                 
                // Trier les posts du plus grand ID au plus petit
                const sortedPosts = data.sort((a, b) => b.id - a.id);

                // Filtrer les posts pour n'afficher que ceux du user connecté
                const filteredPosts = userId
                    ? sortedPosts.filter(post => Number(post.user_id) === userId)
                    : [];

                setPosts(filteredPosts);
                console.log("Posts triés et filtrés :", filteredPosts);
            } catch (error) {
                console.error("Erreur lors de la récupération des posts :", error);
            }
        };
        
        fetchPosts();
    }, [userId]);

      // Fonction pour gérer le clic sur le bouton "Unfollow"
  const handleUnFollow = async (followedId) => {
    const Id = followedId;
    try {
      await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/unfollow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ follower_id: FollowerUserId, followed_id: followedId }),
      });
      console.log("follower_id :", FollowerUserId);
      console.log("followed_id :", followedId);
      router.push(`/home/unfollowedPage?userId=${Id}`);
    } catch (error) {
      console.error("Erreur lors du désabonnement de l'utilisateur :", error);
    }
  };

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
                <div className="text-gray-500 leading-1 text-sm">Himeji, Japan</div>
                <div>
                    <button
                      className="text-gray-800 font-medium text-sm hover:text-blue-500 focus:outline-none"
                      onClick={() => handleUnFollow(userId)}
                    >
                      Unfollow
                    </button>
                </div>
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
                <button onClick={() => handleTabChange('photos')} className={activeTab === 'photos' ? activeTabClasses : tabClasses}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75m-8.69-6.44-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
                  </svg>
                  <span className="hidden sm:block">Documents</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Render components conditionally based on the active tab */}
      {activeTab === 'posts' && (
        <div>
            <div>
                {posts.length > 0 ? (
                    posts.map(post => (
                      <Card>
                           <div className='flex gap-3'>
                                <div>
                                  <Link href={`/home/followedPage?userId=${userId}`}>
                                        <span className="cursor-pointer">
                                            <div className='w-11 relative'>
                                                <div className="rounded-full overflow-hidden">
                                                    <img 
                                                        src={avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                                                        alt="avatar" 
                                                    />
                                                </div>
                                            </div>
                                        </span>
                                    </Link>
                                </div>
                                <div className="grow">
                                    <p>
                                        {username ? (
                                            <FollowedUserNameClient initialUsername={username} />
                                        ) : 'Chargement...'} 
                                        partage un <a className="text-socialBlue">album</a>
                                    </p>
                                </div>
                            </div>
                            <OtherPostCard key={post.id} post={post} />
                      
                      </Card>
                    ))
                ) : (
                    <p>Aucun post trouvé pour l'utilisateur connecté.</p>
                )}
            </div>
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
      {activeTab === 'photos' && (
        <div>
          <Card className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
             <OtherUserFiles photos={photos} videos={videos} pdfs={pdfs} />
          </Card>
        </div>
      )}
    </Layout>
  );
}
