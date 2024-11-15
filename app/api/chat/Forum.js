'use client';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import ProfilePhotoCard from '../../components/forOtherUser/newComponents/ProfilePhotoCard';

const socket = io('http://localhost:3003'); // URL du serveur Socket.IO

const Forum = () => {
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

    // Récupérer tous les messages au moment de la connexion
    useEffect(() => {
        socket.emit('getForumMessages'); // Demander les messages au serveur

        socket.on('receiveForumMessages', (fetchedMessages) => {
            setMessages(fetchedMessages);
        });

        // Écouter les nouveaux messages
        socket.on('receiveForumMessage', (message) => {
            setMessages((prevMessages) => [...prevMessages, message]); // Met à jour les messages en temps réel
        });

        return () => {
            socket.off('receiveForumMessages');
            socket.off('receiveForumMessage');
        };
    }, []);

    const sendMessage = () => {
        if (newMessage.trim() && userId) {
            // Envoi du message avec l'ID de l'utilisateur récupéré
            socket.emit('sendForumMessage', {
                senderId: userId, // Utiliser l'ID utilisateur récupéré
                content: newMessage
            });
            setNewMessage('');

            // Rafraîchir la page après l'envoi
        window.location.reload(); // Cela recharge la page
        }
    };

    const MyId = userId ? Number(userId) : null;  // S'assurer que MyId est assigné correctement

    return (
        <div className="message-container space-y-4 p-4">
            {messages.map((msg, index) => (
                <div
                    key={index}
                    className={`flex ${msg.sender_id === MyId ? 'justify-end' : 'justify-start'}`}
                >
                    <div
                        className={`max-w-xs p-3 rounded-lg ${msg.sender_id === MyId ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
                    >   
                        <ProfilePhotoCard userId={msg.sender_id} />     
                        <strong>{msg.sender_id === MyId ? 'Moi' : `${msg.username}`}</strong>: {msg.content}
                    </div>
                </div>
            ))}
            <div className="mt-4 flex items-center">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Écrire un message..."
                    className="border p-2 w-full rounded-l-lg"
                />
                <button
                    onClick={sendMessage}
                    className="bg-blue-500 text-white p-2 rounded-r-lg"
                >
                    Envoyer
                </button>
            </div>
        </div>
    );
};

export default Forum;
