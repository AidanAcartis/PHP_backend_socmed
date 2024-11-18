'user client';

import { useEffect, useState } from "react";
import Card from "../../forPages/Cards";

// components/Statistics.js
export default function Statistics() {
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
           <h3 className="text-2xl mb-4 text-gray-800 font-semibold">Aperçu des Statistiques</h3>
           {userType === 'service' && (
              <>
                  <p>⏳ Nombre de signalements en cours : 10</p>
                  <p>✅ Nombre de signalements résolus : 5</p>
                  <p>🗂️ Nombre total de signalements : 15</p>
                  <p>🕒 Temps moyen de réponse : 2 heures</p>
                  <p>📈 Pourcentage de signalements résolus dans les délais standards : 80%</p>
                  <p>📊 Types de signalements les plus fréquents : 50% harcèlement, 30% violences physiques</p>
                  <p>😃 Taux de satisfaction des victimes : 90%</p>
              </>
           )}
           {(userType === 'utilisateur' || userType === 'sante') && (
              <>
                  <p>⏳ Statut actuel du signalement : En cours</p>
                  <p>📋 Historique des signalements : 3 signalements, 2 résolus, 1 en cours</p>
                  <p>🕒 Temps estimé pour la réponse : 24 heures</p>
                  <p>👮 Service de sécurité traitant le signalement : Police Locale</p>
                  <p>🔔 Notifications en temps réel : Activées</p>
                  <p>📊 Taux de réponse global de la plateforme : 95%</p>
                  <p>📝 Possibilité de donner un retour sur le service : Disponible après résolution</p>
              </>
           )}
          </section>
    </Card>
    );
  }