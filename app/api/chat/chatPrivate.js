'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import ListOfChat from '../../components/chatWithFriend/listOfChat';
import Card from '../../components/forPages/Cards';

const socket = io('http://localhost:3003');

const PrivateChat = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userId, setUserId] = useState(null); // Ajouter un état pour l'ID utilisateur
    
    // Fonction pour récupérer l'ID utilisateur depuis 'userId.txt'
    const fetchUserId = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userId.txt');
            if (!response.ok) {
                throw new Error("Erreur lors de la récupération de l'ID utilisateur.");
            }
            const userIdFromFile = await response.text();
            setUserId(userIdFromFile.trim());
        } catch (error) {
            console.error("Erreur lors de la récupération de l'ID utilisateur :", error);
        }
    };

    // Charger l'ID utilisateur une seule fois au montage
    useEffect(() => {
        fetchUserId();
    }, []);

    useEffect(() => {
        socket.emit('registerUser', 1); // Remplacez par l'ID de l'utilisateur actuel

        // Réception des messages privés
        socket.on('receivePrivateMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        return () => {
            socket.off('receivePrivateMessage');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim()) {
            socket.emit('sendPrivateMessage', {
                senderId: userId, // Remplacez par l'ID de l'utilisateur actuel
                receiverId,
                content: newMessage
            });
            setNewMessage('');
        }
    };

    return (
          <div className="max-w-4xl mx-auto">  {/* Uniformiser la largeur */}
            <ListOfChat messages={messages} />
          </div>

    );
};

export default PrivateChat;
