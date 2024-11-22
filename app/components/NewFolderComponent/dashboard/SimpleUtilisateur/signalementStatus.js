"use client";
import React, { useEffect, useState } from "react";
import StatusChart from "../../SectionSecurity/secuGraph/evolutionChart";

export default function StatusForUser() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://localhost/Devoi_socila_media/src/backend/controllers/dasboard/getSecurityComplaints.php",
          {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Accès non autorisé. Vérifiez vos informations d'identification.");
          }
          throw new Error("Erreur lors du chargement des données.");
        }

        const result = await response.json();
        console.log("Données récupérées :", result.data); // Debugging
        setData(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">Chargement...</h1>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-2xl font-semibold text-gray-800">
          {error || "Aucune donnée disponible."}
        </h1>
      </div>
    );
  }

  const { description, security_complaint, status_history, internal_comments } = data;

  const renderStatusChart = (signalementId) => (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
      <StatusChart signalementId={signalementId} />
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <div className="max-w-5xl mx-auto py-12 px-6">
        <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Détails du Signalement
        </h1>

        <div className="bg-white rounded-lg shadow-lg p-8 max-w-3xl mx-auto">
          <h2 className="text-3xl font-extrabold text-center text-gray-900 mb-6">
            <span role="img" aria-label="info">📋</span> Informations Générales
          </h2>
          <div className="space-y-4">
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Description :</span> {description}
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Service Responsable :</span> {security_complaint?.responsible_service || "Non spécifié"} 
              <span role="img" aria-label="service">🔧</span>
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Statut Actuel :</span> {security_complaint?.current_status || "Non spécifié"}
              <span role="img" aria-label="status">✅</span>
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Étape Suivante :</span> {security_complaint?.next_step || "Non spécifié"}
              <span role="img" aria-label="next-step">➡️</span>
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Date Suivante :</span> 
              {security_complaint?.next_date ? new Date(security_complaint.next_date).toLocaleDateString() : "Non spécifiée"}
              <span role="img" aria-label="calendar">📅</span>
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Priorité :</span> {security_complaint?.priority || "Non spécifiée"} 
              <span role="img" aria-label="priority">⚡</span>
            </p>
            <p className="text-lg text-gray-800">
              <span className="font-semibold text-blue-600">Dernière Mise à Jour :</span> 
              {security_complaint?.updated_at ? new Date(security_complaint.updated_at).toLocaleString() : "Non spécifiée"}
              <span role="img" aria-label="update">🔄</span>
            </p>
          </div>
        </div>

        {status_history?.length > 0 && renderStatusChart(status_history[0].signalement_id)}

        {/* Recents */}
        {status_history && status_history.length > 0 ? (
           <section className="mt-8">
           <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
               <span className="bg-gray-200"><span>📝</span>Actions Récentes</span>
           </h2>
           <div className="bg-white p-6 rounded-lg shadow-lg mt-4 border-l-4 border-green-600">
              {status_history.map((comment, index) => (
                <ul key={index} className="text-gray-700">
                    <li className="flex items-center space-x-2">
                        <span className="text-green-600">🟢</span>
                        <span className="text-gray-700">{comment.change_date} - {comment.new_step}</span>
                    </li>
                </ul>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-500 mt-10">Aucun événement récent disponible.</p>
        )}
    
              
        {/* Commentaires Internes */}
        {status_history && status_history.length > 0 ? (
           <section className="mt-8">
           <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
               <span className="bg-gray-200"><span>💬</span>Commentaires Internes</span>
           </h2>
            <div className="bg-white p-6 rounded-lg shadow-lg mt-4 border-l-4 border-blue-600">
              {status_history.map((comment, index) => (
                <p key={index} className="text-gray-700">
                  <span className="font-semibold">{comment.change_date} -</span>
                <span className="italic">"{comment.comments}"</span>{" "}
                </p>
              ))}
            </div>
          </section>
        ) : (
          <p className="text-gray-500 mt-10">Aucun commentaire interne disponible.</p>
        )}
      </div>
    </div>
  );
}
