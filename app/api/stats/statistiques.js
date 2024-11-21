import { useEffect, useState } from 'react';
import {
  fetchTotalPlaintes,
  fetchRepartitionParRegion,
  fetchTypesDeViolences,
  fetchStatsParJour,
  fetchTempsMoyen,
  fetchTotalStatusPlaintes 
} from '../services/api';

export default function Statistiques() {
  const [total, setTotal] = useState(0);
  const [regions, setRegions] = useState([]);
  const [types, setTypes] = useState([]);
  const [parJour, setParJour] = useState([]);
  const [tempsMoyen, setTempsMoyen] = useState(0);
  const [statusPlaintes, setStatusPlaintes] = useState([]); // Ajout de l'état 'statusPlaintes'
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

  useEffect(() => {
    fetchTotalPlaintes().then(data => setTotal(data.total));
    fetchRepartitionParRegion().then(data => setRegions(data));
    fetchTypesDeViolences().then(data => setTypes(data));
    fetchStatsParJour().then(data => setParJour(data));
    fetchTempsMoyen().then(data => setTempsMoyen(data.temps_moyen));
    fetchTotalStatusPlaintes() // Appel de la nouvelle fonction
    .then(data => setStatusPlaintes(data)); // Met à jour l'état avec les données reçues
  }, []);

  return (
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto space-y-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6 flex items-center justify-center">
        🌍 Statistiques Globales
      </h1>
  
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          📊 Nombre total de plaintes
        </h2>
        <p className="text-xl text-gray-600">{total} plaintes signalées</p>
      </div>
  
      <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
        📊 Répartition des plaintes par statut
      </h2>
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <ul>
          {statusPlaintes.map((status, index) => {
            const statusInfo = statuses.find(s => s.label === status.current_status);
            return (
              <li key={index} className="flex items-center space-x-2">
                <span
                  className={`w-4 h-4 rounded-full ${statusInfo ? statusInfo.color : 'bg-gray-300'}`}
                ></span>
                <span>{status.current_status}: {status.count}</span>
              </li>
            );
          })}
        </ul>
      </div>
  
      {/* Répartition par région */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          📍 Répartition par région
        </h2>
        <ul className="space-y-3">
          {regions.map((region, idx) => (
            <li key={idx} className="text-lg text-gray-700">
              {region.location}: <span className="font-bold">{region.count} plaintes</span>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Types de violences */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          🔴 Types de violences signalées
        </h2>
        <ul className="space-y-3">
          {types.map((type, idx) => (
            <li key={idx} className="text-lg text-gray-700">
              {type.description}: <span className="font-bold">{type.count}</span>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Statistiques par jour */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          📅 Statistiques par jour
        </h2>
        <ul className="space-y-3">
          {parJour.map((jour, idx) => (
            <li key={idx} className="text-lg text-gray-700">
              {jour.jour}: <span className="font-bold">{jour.count} plaintes</span>
            </li>
          ))}
        </ul>
      </div>
  
      {/* Temps moyen de traitement */}
      <div className="bg-blue-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
          ⏱ Temps moyen de traitement
        </h2>
        <p className="text-xl text-gray-600">{tempsMoyen} minutes</p>
      </div>
    </div>
  );
}