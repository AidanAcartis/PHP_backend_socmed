'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ProfilePhotoCard from '../../components/forOtherUser/newComponents/ProfilePhotoCard';

const socket = io('http://localhost:3003');

export default function Chat({ userId }) {
  const [newMessage, setNewMessage] = useState(''); // Nouveau message à envoyer
  const [messages, setMessages] = useState([]); // Liste des messages échangés
  const [loggedInUserId, setLoggedInUserId] = useState(null); // ID de l'utilisateur connecté

  // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
  const fetchUserId = async () => {
    try {
      const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
      if (!response.ok) {
        throw new Error("Erreur lors de la récupération de l'ID utilisateur.");
      }
      const userIdFromFile = await response.text();
      setLoggedInUserId(userIdFromFile.trim());
      console.log('ID utilisateur récupéré:', userIdFromFile.trim()); // Log de l'ID utilisateur
    } catch (error) {
      console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
    }
  };

  // Fonction pour envoyer un message
  const sendMessage = () => {
    if (newMessage.trim()) {
      console.log('Message envoyé:', newMessage); // Log du message à envoyer
      socket.emit('sendPrivateMessage', {
        senderId: loggedInUserId,
        receiverId: userId,
        content: newMessage,
      });
      setNewMessage('');
      window.location.reload();
    } else {
      console.log('Message vide, rien à envoyer.');
    }
  };

  // Fonction pour récupérer les messages échangés
  useEffect(() => {
    // Vérifiez que la connexion WebSocket est bien établie
    socket.on('connect', () => {
      console.log('WebSocket connecté:', socket.id); // Log de la connexion WebSocket
    });

    fetchUserId();

    if (loggedInUserId && userId) {
      console.log('Récupération des messages entre', loggedInUserId, 'et', userId);
      socket.emit('getMessages', { senderId: loggedInUserId, receiverId: userId });
    }

    // Réception des messages depuis le serveur
    socket.on('receiveMessages', (messages) => {
      console.log('Messages reçus:', messages); // Log des messages reçus
      setMessages(messages);
    });

    // Nettoyage des écouteurs
    return () => {
      socket.off('connect');
      socket.off('receiveMessages');
    };
  }, [loggedInUserId, userId]);

  const MyId = Number(loggedInUserId);

  return (
    <div className=" space-y-4 p-4">
        {/* Messages container */}
        <div>
                {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.sender_id === MyId ? 'justify-end' : 'justify-start'}`}
          >
            <div className="flex flex-col">
              <div>
                <small className="message-time text-xs text-gray-500 mt-1">
                  {new Date(message.sent_at).toLocaleTimeString()}
                </small>
                <div className='flex items-center gap-2'>
                    {/* Affichage de la photo de profil */}
                    <ProfilePhotoCard userId={message.sender_id} />
                    {/* Affichage du nom de l'expéditeur ou du destinataire */}
                    <strong>
                      {message.sender_id === MyId ? message.sender_username : message.sender_username}
                    </strong>
                </div>
              </div>

              {/* Affichage du contenu du message */}
              <div
                className={`message mb-5 p-4 rounded-xl max-w-xl ${
                  message.sender_id === MyId
                    ? 'bg-blue-400 text-white self-end ml-auto shadow-md'
                    : 'bg-green-100 text-gray-800 self-start mr-auto shadow-md'
                }`}
              >
                <p className="message-content text-base leading-relaxed">{message.content}</p>
              </div>
            </div>
          </div>
        ))}

        </div>

      {/* Message input */}
      <div className="flex items-center space-x-4 mt-2">
        <input 
          type="text" 
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 placeholder-gray-500 text-gray-800 shadow-sm transition-all duration-200"
          placeholder="Écrire un message..."
        />
        <button 
          onClick={sendMessage}
          className="bg-blue-600 text-white px-5 py-3 rounded-full hover:bg-blue-700 focus:outline-none transition duration-200 shadow-lg"
        >
          Send
        </button>
      </div>
    </div>
  );
}
