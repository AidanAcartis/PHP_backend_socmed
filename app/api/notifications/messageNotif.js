'use client';

import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const UnreadMessagesComponent = ({ userId }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            console.error('userId est requis pour la connexion WebSocket.');
            return;
        }

        // Créer une connexion WebSocket au serveur
        const socket = io('http://localhost:3003');

        // Envoyer une demande de messages non lus lorsque la connexion est établie
        socket.emit('getUnreadMessages', userId);

        // Écouter l'événement 'unreadMessagesCount' pour recevoir le nombre de messages non lus
        socket.on('unreadMessagesCount', (data) => {
            setUnreadCount(data.unreadCount);
        });

        // Nettoyer la connexion lorsque le composant est démonté
        return () => {
            socket.disconnect();
        };
    }, [userId]);

    return (
        <div className="relative">
            {unreadCount > 0 && (
                <span className="absolute -top-2 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs z-10">
                    {unreadCount}
                </span>
            )}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
        </div>
    );
};

export default UnreadMessagesComponent;
