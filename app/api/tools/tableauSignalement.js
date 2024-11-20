'use client';

import React, { useEffect, useState } from 'react';

const statuses = [
  { label: "Reçu", color: "bg-blue-500" },
  { label: "En vérification", color: "bg-yellow-500" },
  { label: "En attente de résolution", color: "bg-orange-500" },
  { label: "Résolu", color: "bg-green-500" },
  { label: "Rejeté", color: "bg-red-500" },
  { label: "Assigné", color: "bg-teal-500" },
  { label: "En cours de traitement", color: "bg-purple-500" },
  { label: "Reporté", color: "bg-gray-500" },
  { label: "En attente de documents", color: "bg-indigo-500" },
  { label: "En appel", color: "bg-pink-500" },
  { label: "Clôturé", color: "bg-green-700" },
  { label: "Escalade", color: "bg-red-700" },
];

export default function ChartSignalement() {
  const [signalement, setSignalement] = useState(null);
  const [currentSignalementId, setCurrentSignalementId] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [visibleSignalement, setVisibleSignalement] = useState(null);

  useEffect(() => {
    const fetchSignalement = async () => {
      if (!currentSignalementId) return;

      try {
        const res = await fetch(
          `http://localhost/Devoi_socila_media/src/backend/api/signalement/signalementDisplay.php?id=${currentSignalementId}`
        );
        if (!res.ok) throw new Error("Erreur lors du chargement du signalement");
        const data = await res.json();
        setSignalement(data);
      } catch (err) {
        console.error(err.message);
      }
    };

    fetchSignalement();
  }, [currentSignalementId]);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          'http://localhost/Devoi_socila_media/src/backend/api/signalement/signalementBoard.php'
        );
        if (!response.ok) throw new Error('Réponse du serveur incorrecte');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setComplaints(data.data);
        } else {
          console.error('Données non valides');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchComplaints();
  }, []);

  const toggleWatchSignalement = (signalementId) => {
    const newId = visibleSignalement === signalementId ? null : signalementId;
    setVisibleSignalement(newId);
    setCurrentSignalementId(newId);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Signalements</h1>
      <table className="min-w-full table-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <thead>
          <tr className="bg-indigo-50 border-b border-gray-200">
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Résumé</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priorité</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Responsable</th>
            
          </tr>
        </thead>
        <tbody>
          {complaints.map((complaint) => {
            const status = statuses.find(status => status.label === complaint.current_status);
            const isVisible = visibleSignalement === complaint.id;
           
            return (
              <React.Fragment key={complaint.id}>
                <tr className="border-b hover:bg-indigo-50 transition-colors duration-300 ease-in-out">
                  <td className="py-3 px-4 flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${status ? status.color : 'bg-gray-300'}`}></div>
                    {complaint.current_status}
                  </td>
                  <td className="py-3 px-4 text-sm">{complaint.date}</td>
                  <td className="py-3 px-4 text-sm">{complaint.description.substring(0, 30)}...</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => toggleWatchSignalement(complaint.id)}
                      className="text-blue-500 hover:text-blue-700 focus:outline-none transition-all"
                    >
                      {isVisible ? 'Masquer' : 'Voir'}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-sm">{complaint.priority}</td>
                  <td className="py-3 px-4 text-sm">{complaint.responsible_service}</td>
                </tr>
                {isVisible && signalement && (
                  <tr>
                    <td colSpan="6" className="py-3 px-4">
                      <div className="p-8 bg-gray-50 shadow-lg rounded-lg">
                        <h2 className="text-xl font-bold mb-4">Détails du Signalement</h2>
                        <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-semibold text-gray-500">Nom Complet</p>
                <p className="text-lg text-gray-700">{signalement.full_name}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Date</p>
                <p className="text-lg text-gray-700">{signalement.date}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Heure</p>
                <p className="text-lg text-gray-700">{signalement.hour}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Localisation</p>
                <p className="text-lg text-gray-700">{signalement.location}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-semibold text-gray-500">Description</p>
                <p className="text-lg text-gray-700">{signalement.description}</p>
              </div>
              {signalement.file_path && (
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-500">Fichier</p>
                  <a
                    href={signalement.file_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    Télécharger le fichier
                  </a>
                </div>
              )}
              {signalement.signature_path && (
                <div className="col-span-2">
                  <p className="text-sm font-semibold text-gray-500">Signature</p>
                  <img
                    src={signalement.signature_path}
                    alt="Signature"
                    className="rounded-lg shadow-md max-h-48"
                  />
                </div>
              )}
            </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
