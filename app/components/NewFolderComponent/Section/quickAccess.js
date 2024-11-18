import Card from "../../forPages/Cards";
import { useState, useEffect } from 'react';

export default function QuickAccess() {
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
                <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Suivi Juridique</h3>
                <div className="space-y-4">
                    {userType === 'utilisateur' && (
                        <>
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">🚨 Soumettre un signalement</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">📊 Consulter le tableau de bord</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">🧾 Ajouter des preuves</p>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">🏢 Consulter les ressources</p>
                            </div>
                        </>
                    )}
                    {userType === 'securite' && (
                        <>
                            {/* Gérer les signalements */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">🛡️ Gérer les signalements</p>
                            </div>

                            {/* Consulter le tableau de bord des cas */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">📊 Consulter le tableau de bord des cas</p>
                            </div>

                            {/* Ajouter des commentaires ou des rapports */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">📝 Ajouter des commentaires ou des rapports</p>
                            </div>

                            {/* Analyser les preuves fournies */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">🔍 Analyser les preuves fournies</p>
                            </div>

                            {/* Mettre à jour l'état des plaintes */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">⚖️ Mettre à jour l'état des plaintes</p>
                            </div>

                            {/* Communiquer avec la victime */}
                            <div className="flex items-center gap-4">
                                <p className="text-gray-800">💬 Communiquer avec la victime</p>
                            </div>

                        </>
                    )}
                </div>
            </section>
        </Card>
    );
}
