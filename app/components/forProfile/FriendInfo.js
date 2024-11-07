'use client';

import { getUserProfilePhoto } from "../forOtherUser/newComponents/otherProfilePhoto";
import { getUserProfile } from "../forOtherUser/newComponents/otherUserName";
import Avatar from "../forPages/Avatar";
import { useEffect, useState } from 'react';

export default function FriendInfo() {
  const [loggedInUserId, setLoggedInUserId] = useState(null); // État pour l'ID utilisateur
  const [friends, setFriends] = useState([]); // État pour les amis filtrés
  const [friendsData, setFriendsData] = useState([]); // État pour les données enrichies des amis
  const [followingStatus, setFollowingStatus] = useState({}); // État pour suivre ou ne pas suivre un ami

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

  // Vérification de l'état de suivi pour chaque ami
  const verifyFollowing = async () => {
    try {
      const status = {};
      for (const friend of friends) {
        const followResponse = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/followers/check_follow_status.php?userId=${friend.followed_id}`, {
          credentials: 'include',
        });
        const followData = await followResponse.json();
        status[friend.followed_id] = followData.isFollowing;
      }
      setFollowingStatus(status);
    } catch (error) {
      console.error('Erreur de récupération du statut de suivi:', error);
    }
  };

  // Fonction pour gérer le clic sur le bouton "Follow"
  const handleFollow = async (followedId) => {
    try {
      await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/follow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ follower_id: loggedInUserId, followed_id: followedId }),
      });
      setFollowingStatus(prevStatus => ({
        ...prevStatus,
        [followedId]: true
      }));
    } catch (error) {
      console.error("Erreur lors du suivi de l'utilisateur :", error);
    }
    window.location.reload();
  };

  // Fonction pour gérer le clic sur le bouton "Unfollow"
  const handleUnFollow = async (followedId) => {
    try {
      await fetch('http://localhost/Devoi_socila_media/src/backend/api/followers/unfollow.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include', 
        body: JSON.stringify({ follower_id: loggedInUserId, followed_id: followedId }),
      });
      setFollowingStatus(prevStatus => ({
        ...prevStatus,
        [followedId]: false
      }));
    } catch (error) {
      console.error("Erreur lors du désabonnement de l'utilisateur :", error);
    }
    window.location.reload();
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

  // Vérifier le statut de suivi après l'enrichissement des amis
  useEffect(() => {
    if (friendsData.length > 0) {
      verifyFollowing();
    }
  }, [friendsData]);

  return (
    <div className="flex flex-col gap-4">
      {friendsData.map((friend, index) => (
        <div key={index} className="flex gap-2 border-b p-4 border-b-gray-100 -mx-4">
          <div className='w-11 relative'>
            <div className="rounded-full overflow-hidden">
              <img 
                src={friend.avatarUrl || "https://static.miraheze.org/allthetropeswiki/0/0b/Girls_und_Panzer_-_Nekonyaa.png"} 
                alt="avatar" 
              />
            </div>
          </div>
          <div>
            <h2 className="font-bold text-xl">{friend.username}</h2>
            <div className="text-sm leading-4">
              {friend.followerCount} followers
            </div>
          </div>
          <button
            className="text-gray-800 font-medium text-sm hover:text-blue-500 focus:outline-none ml-12"
            onClick={() => followingStatus[friend.followed_id] ? handleUnFollow(friend.followed_id) : handleFollow(friend.followed_id)}
          >
            {followingStatus[friend.followed_id] ? 'Unfollow' : 'Follow'}
          </button>
        </div>
      ))}
    </div>
  );
}
