'use client';

import React, { useState, useEffect } from 'react';

const NotificationComponent = ({ userId }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!userId) {
            console.error('userId est requis pour la connexion SSE.');
            return;
        }

        // Créer une nouvelle connexion SSE avec le serveur en incluant l'ID de l'utilisateur
        const eventSource = new EventSource(`http://localhost:3003/notifications/sse/${userId}`);

        // Lorsque de nouvelles données sont reçues
        eventSource.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                setUnreadCount(data.unread_count);
            } catch (error) {
                console.error('Erreur de parsing des données SSE:', error);
            }
        };

        // En cas d'erreur avec la connexion SSE
        eventSource.onerror = (error) => {
            console.error('Erreur SSE:', error);
            eventSource.close(); // Fermer la connexion en cas d'erreur pour éviter une boucle infinie
        };

        // Fermer la connexion lorsque le composant est démonté
        return () => {
            eventSource.close();
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
                    </svg>
        </div>
    );
};

export default NotificationComponent;
