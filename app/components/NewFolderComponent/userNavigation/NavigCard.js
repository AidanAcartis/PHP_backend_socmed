"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "../../forPages/Cards";
import NotificationComponent from "../../../api/notifications/notifAlert";


export default function UserNavigationCard() {
    const pathname = usePathname();
    const activeElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 bg-socialBlue text-white md:-mx-8 px-6 md:px-8 rounded-md shadow-md shadow-gray-300 md:shadow-none';
    const nonActiveElementClasses = 'text-sm md:text-md flex gap-1 md:gap-3 py-2 my-2 hover:bg-blue-200 hover:blue-opacity-20 md:-mx-4 md:px-4 rounded-md transition-all hover:scale-110 hover:shadow-md shadow-gray-300';

    const [activeTab, setActiveTab] = useState('home');
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

    const TheId = userId;

    useEffect(() => {
        const currentPath = pathname.split('/').pop();
        if (['home', 'status', 'contacts', 'notifications', 'logout', 'forum', 'message'].includes(currentPath)) {
            setActiveTab(currentPath);
        }
        else if(['status', 'Activité', 'suggestions', 'agenda'].includes(currentPath)){
            setActiveTab('status');
        }
        else {
            setActiveTab('home');
        }
    }, [pathname]);

    const [isNotifClicked, setIsNotifClicked] = useState(false);

    const handleUpdateNotif = () => {
        // Logique pour la mise à jour des notifications
        setIsNotifClicked(true); // Met à jour l'état pour indiquer que le bouton a été cliqué
    };
 
    return (
        <div className="md:fixed md:w-[200px]">
            <Card noPadding={true}>
            <div className="px-4 py-2 flex justify-between md:block shadow-md shadow-gray-500">
                <h2 className="text-gray-400 mb-3 hidden md:block">Navigation</h2>
                <Link href="/home" className={activeTab === 'home' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h18M3 6h18M3 18h18" />
                    </svg>
                    <span className="hidden md:block">Home</span>
                </Link>
                <Link href="/home/patientProfile/status" className={activeTab === 'status' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 2.994v2.25m10.5-2.25v2.25m-14.252 13.5V7.491a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v11.251m-18 0a2.25 2.25 0 0 0 2.25 2.25h13.5a2.25 2.25 0 0 0 2.25-2.25m-18 0v-7.5a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v7.5m-6.75-6h2.25m-9 2.25h4.5m.002-2.25h.005v.006H12v-.006Zm-.001 4.5h.006v.006h-.006v-.005Zm-2.25.001h.005v.006H9.75v-.006Zm-2.25 0h.005v.005h-.006v-.005Zm6.75-2.247h.005v.005h-.005v-.005Zm0 2.247h.006v.006h-.006v-.006Zm2.25-2.248h.006V15H16.5v-.005Z" />
                    </svg>
                    <span className="hidden md:block">Statuts</span>
                </Link>
                <Link href="/home/patientProfile/contacts" className={activeTab === 'contacts' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                    </svg>
                    <span className="hidden md:block">Contacts</span>
                </Link>
                <Link 
                    href="/home/notifications" 
                    className={activeTab === 'notifications' ? activeElementClasses : nonActiveElementClasses}
                    onClick={() => handleUpdateNotif()}
                >
                   {/* Affiche NotificationComponent seulement si isNotifClicked est faux */}
                   {!isNotifClicked && <NotificationComponent userId={TheId} />} 
                    <span className="hidden md:block">Notifications</span>
                </Link>
                <Link 
                    href="/home/forum" 
                    className={activeTab === 'forum' ? activeElementClasses : nonActiveElementClasses}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                    </svg>
                    <span className="hidden md:block">Forum</span>
                </Link>
                <Link 
                    href="/home/message" 
                    className={activeTab === 'message' ? activeElementClasses : nonActiveElementClasses}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                    </svg>
                    <span className="hidden md:block">Messenger</span>
                </Link>
                <Link href="/home/logout" className={activeTab === 'logout' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                    </svg>
                    <span className="hidden md:block">Log out</span>
                </Link>
            </div>
        </Card>
        </div>
    );
}
