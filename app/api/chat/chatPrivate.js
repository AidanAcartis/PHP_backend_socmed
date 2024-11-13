'use client';

import { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3003');

const PrivateChat = ({ receiverId }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        socket.emit('registerUser', 1); // Remplacez par l'ID de l'utilisateur actuel

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
                senderId: 1, // Remplacez par l'ID de l'utilisateur actuel
                receiverId,
                content: newMessage
            });
            setNewMessage('');
        }
    };

    return (
        <div>
            <div className="message-container">
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.senderId}</strong>: {msg.content}
                    </div>
                ))}
            </div>
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Écrire un message privé..."
            />
            <button onClick={sendMessage}>Envoyer</button>
        </div>
    );
};

export default PrivateChat;