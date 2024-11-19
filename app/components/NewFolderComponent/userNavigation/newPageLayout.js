'use client';

import { useEffect, useState } from "react";
import UserNavigationCard from "./NavigCard";
import SecuFonctNavigationCard from "../Navigation/secufonctNav";

export default function PageLayout({children, hideNavigation}) {
    const [userType, setUserType] = useState('');

    const fetchUserType = async () => {
        try {
            const response = await fetch('http://localhost:3003/Devoi_socila_media/src/backend/controllers/users/userType.txt');
            const userTypeFromFile = await response.text();
            setUserType(userTypeFromFile);
            console.log('userType:', userType);
        } catch (error) {
            console.error("Erreur lors de la récupération du type utilisateur :", error);
        }
    };

    useEffect(() => {
        fetchUserType();
    }, []);

    let rightColumnClasses = '';
    if(hideNavigation) {
        rightColumnClasses += 'w-full';
    }else {
        rightColumnClasses += 'mx-4 md:mx-0 md:w-9/12';
    }

    return (
        <div>
            {userType === 'utilisateur' && (
                        <>
                            <div className="md:flex mt-4 max-w-4xl mx-auto gap-6 mb-24 md:mb-0">
                            {!hideNavigation && (
                                <div className="fixed w-full md:static bottom-0 md:w-3/12 -mb-5">
                                    <UserNavigationCard />
                                </div>
                            )}
                            <div className={rightColumnClasses}>
                                {children}
                            </div>
                            </div>          
                        </>)}
                        {userType === 'securite' && (
                        <>
                            <div className="md:flex mt-4 max-w-4xl mx-auto gap-6 mb-24 md:mb-0">
                            {!hideNavigation && (
                                <div className="fixed w-full md:static bottom-0 md:w-3/12 -mb-5">
                                    <SecuFonctNavigationCard />
                                </div>
                            )}
                            <div className={rightColumnClasses}>
                                {children}
                            </div>
                            </div>          
                        </>)}
        </div>
    );
}