"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Card from "./Cards";
import Notifications from "../../api/notifications/notifAlert";
import NotificationComponent from "../../api/notifications/notifAlert";
import Forum from "../../api/chat/Forum";
import UnreadMessagesComponent from "../../api/notifications/messageNotif";

export default function NavigationCard() {
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
        if (['home', 'parameters', 'patientProfile', 'profile', 'saved', 'notifications', 'logout', 'forum', 'message'].includes(currentPath)) {
            setActiveTab(currentPath);
        }
        else if(['about', 'posts', 'friends', 'photos'].includes(currentPath)){
            setActiveTab('profile');
        }
        else {
            setActiveTab('home');
        }
    }, [pathname]);

    const [isNotifClicked, setIsNotifClicked] = useState(false);
    const [isMessClicked, setIsMessClicked] = useState(false);

    const handleUpdateMess = () => {
        // Logique pour la mise à jour des notifications
        setIsMessClicked(true); // Met à jour l'état pour indiquer que le bouton a été cliqué
    };

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
                <Link href="/home/patientProfile" className={activeTab === 'patientProfile' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                    </svg>
                    <span className="hidden md:block">Dashboard</span>
                </Link>
                <Link href="/home/profile" className={activeTab === 'profile' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                    </svg>
                    <span className="hidden md:block">Profile</span>
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
                    onClick={() => handleUpdateMess()}
                >
                   {/* Affiche NotificationComponent seulement si isNotifClicked est faux */}
                   {!isMessClicked && <UnreadMessagesComponent userId={TheId} />} 
                    <span className="hidden md:block">Messenger</span>
                </Link>
                <Link href="/home/parameters" className={activeTab === 'parameters' ? activeElementClasses : nonActiveElementClasses}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                    <span className="hidden md:block">Parameters</span>
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
