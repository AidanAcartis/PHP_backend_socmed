'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { getUserProfile } from "../forOtherUser/newComponents/otherUserName";
import { getUserProfilePhoto } from "../forOtherUser/newComponents/otherProfilePhoto";
import io from 'socket.io-client';
import Chat from "../../api/chat/privateMessage";

const socket = io('http://localhost:3003');

export default function FriendToTalk() {
  const [loggedInUserId, setLoggedInUserId] = useState(null); // État pour l'ID utilisateur
  const [friends, setFriends] = useState([]); // État pour les amis filtrés
  const [friendsData, setFriendsData] = useState([]); // État pour les données enrichies des amis
  const [isChatting, setIsChatting] = useState(false); // État pour savoir si on est en mode chat
  const [chatReceiverId, setChatReceiverId] = useState(null); // ID de l'ami avec lequel discuter
  const [newMessage, setNewMessage] = useState(''); // Nouveau message à envoyer

  const router = useRouter(); // Initialize useRouter for navigation

  // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'ID utilisateur.");
      }
      const userIdFromFile = await response.text();
      setLoggedInUserId(userIdFromFile.trim());
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
    }
  };

  // Fonction pour récupérer et filtrer les amis depuis la table 'followers'
  const fetchFriends = async (id) => {
    try {
      const response = await fetch('http://localhost/Devoi_socila_media/src/backend/api/friends/allFriends.php');
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération des amis.");
      }
      const data = await response.json();

      // Filtrer les amis correspondant à l'userId
      const filteredFriends = data.data.filter(friend => friend.follower_id === id);

      // Compter le nombre de followers pour chaque followed_id
      const followerCountMap = data.data.reduce((acc, friend) => {
        acc[friend.followed_id] = (acc[friend.followed_id] || 0) + 1;
        return acc;
      }, {});

      // Ajouter le nombre de followers à chaque ami filtré
      const enrichedFriends = filteredFriends.map(friend => ({
        ...friend,
        followerCount: followerCountMap[friend.followed_id] || 0
      }));

      setFriends(enrichedFriends);
    } catch (error) {
      console.error("Erreur lors de la récupération des amis :", error);
    }
  };

  // Fonction pour enrichir les amis avec leur nom d'utilisateur et photo de profil
  const enrichFriendsData = async () => {
    try {
      const enrichedData = await Promise.all(
        friends.map(async (friend) => {
          const username = await getUserProfile(friend.followed_id);
          const avatarUrl = await getUserProfilePhoto(friend.followed_id);
          return { ...friend, username, avatarUrl };
        })
      );
      setFriendsData(enrichedData);
    } catch (error) {
      console.error("Erreur lors de l'enrichissement des données des amis :", error);
    }
  };

  // Fonction pour gérer le clic sur le bouton de démarrage de discussion
  const handleChatStart = (friendId) => {
    setChatReceiverId(friendId);
    setIsChatting(true);
  };

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (newMessage.trim()) {
      socket.emit('sendPrivateMessage', {
        senderId: loggedInUserId, // Remplacez par l'ID de l'utilisateur actuel
        receiverId: chatReceiverId,
        content: newMessage
      });
      setNewMessage('');
    }
  };

  // Charger l'ID utilisateur au montage
  useEffect(() => {
    fetchUserId();
  }, []);

  // Charger les amis une fois que l'userId est défini
  useEffect(() => {
    if (loggedInUserId) {
      fetchFriends(loggedInUserId);
    }
  }, [loggedInUserId]);

  // Enrichir les données des amis une fois que la liste des amis est récupérée
  useEffect(() => {
    if (friends.length > 0) {
      enrichFriendsData();
    }
  }, [friends]);

  return (
    <div className="flex flex-col gap-4">
      {/* Button to toggle friend list view */}
      <button 
        onClick={() => setIsChatting(false)} 
        className="font-bold text-3xl mb-2 text-blue-500 hover:underline"
      >
        Friends
      </button>

      {!isChatting ? (
        // Display the friends list
        friendsData.map((friend, index) => (
          <div key={index} className="flex gap-4 border-b p-4 border-b-gray-100 -mx-4">
            <a 
              href="#"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/home/followedPage?userId=${friend.followed_id}`);
              }}
            >
              <div className='flex items-center gap-4'>
                {/* Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden">
                  <img 
                    src={friend.avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                    alt="avatar" 
                    className="object-cover w-full h-full"
                  />
                </div>

                {/* Info on the right (username + followers count) */}
                <div className="flex flex-col justify-between">
                  {/* Username */}
                  <h2 className="font-bold text-xl">{friend.username}</h2>

                  {/* Follower count */}
                  <div className="text-sm text-gray-500">
                    {friend.followerCount} followers
                  </div>
                </div>
              </div>
            </a>

            {/* Start chat button */}
            <button
              onClick={() => handleChatStart(friend.followed_id)}
              className="text-gray-800 font-medium text-sm hover:text-blue-500 focus:outline-none"
            >
              Start Chat
            </button>
          </div>
        ))
      ) : (
        // Display chat interface when a friend is selected
        <div>
          <h2>Chat with {friendsData.find(friend => friend.followed_id === chatReceiverId)?.username}</h2>
          <Chat userId={friendsData.find(friend => friend.followed_id === chatReceiverId)?.followed_id}/>
        </div>
      )}
    </div>
  );
}
