'use client';

import { useEffect, useState } from "react";
import Card from "../../forPages/Cards";

export default function SectionMental() {
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
    return (
        <Card>
            <section className="bg-[#FFF8E8] my-8 p-6 rounded-lg shadow-lg max-h-[263px] overflow-y-auto">
    <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Suivi de la santé mentale</h3>
    <div className="space-y-4">
    {userType === 'utilisateur' && (
                        <> 
                       {/* Suivi des séances de thérapie */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🛋️ Suivi des séances de thérapie</p>
        </div>

        {/* Suivi de l'humeur */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🙂 Suivi de l'humeur</p>
        </div>

        {/* Suivi des objectifs */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🎯 Suivi des objectifs</p>
        </div>

        {/* Notifications de santé */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🔔 Notifications de santé</p>
        </div>

        {/* Évaluation de santé mentale */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🧠 Évaluation de santé mentale</p>
        </div>

        {/* Suivi des symptômes */}
        <div className="flex items-center gap-4">
            <p className="text-gray-800">🤕 Suivi des symptômes</p>
        </div> 
    </>)}
    {userType === 'sante' && (
                        <>
                        {/* Gérer les dossiers des patientes */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">📂 Gérer les dossiers des patientes</p>
                </div>

                {/* Programmer des séances de thérapie */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">📅 Programmer des séances de thérapie</p>
                </div>

                {/* Ajouter des rapports médicaux */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">📝 Ajouter des rapports médicaux</p>
                </div>

                {/* Suivi des progrès des patientes */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">📈 Suivi des progrès des patientes</p>
                </div>

                {/* Consultation en ligne */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">💻 Consultation en ligne</p>
                </div>

                {/* Envoyer des notifications de santé */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">🔔 Envoyer des notifications de santé</p>
                </div>

                {/* Partager des ressources éducatives */}
                <div className="flex items-center gap-4">
                    <p className="text-gray-800">📚 Partager des ressources éducatives</p>
                </div>

         </>)}
        
    </div>
</section>

        </Card>
    );
}
