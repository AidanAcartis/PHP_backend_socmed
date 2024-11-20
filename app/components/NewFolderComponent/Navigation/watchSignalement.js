'use client';

import { useEffect, useState } from "react";

const WatchSignalement = ({ signalementId: initialSignalementId }) => {
  const [signalement, setSignalement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentSignalementId, setCurrentSignalementId] = useState(initialSignalementId);

  // Récupérer l'ID depuis l'URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('signalementId');

    if (id) {
      setCurrentSignalementId(Number(id)); // Convertir l'ID en nombre
    } else {
      console.error("signalementId est undefined");
      setLoading(false);
      return;
    }
  }, []);

  useEffect(() => {
    const fetchSignalement = async () => {
      if (!currentSignalementId) return; // Assurez-vous que l'ID est défini

      try {
        const res = await fetch(`http://localhost/Devoi_socila_media/src/backend/api/signalement/signalementDisplay.php?id=${currentSignalementId}`);
        if (!res.ok) throw new Error("Erreur lors du chargement du signalement");
        const data = await res.json();
        setSignalement(data);
        console.log('Signalement:', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSignalement();
  }, [currentSignalementId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-gray-500">Chargement...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-lg font-semibold text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-white py-10 px-6">
        <div className="max-w-4xl mx-auto bg-gray-50 shadow-lg rounded-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">
              Détails du Signalement
            </h1>
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
        </div>
      </div>
    </div>
    
  );
};

export default WatchSignalement;
