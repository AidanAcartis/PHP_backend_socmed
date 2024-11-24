// pages/evaluations.js
'user client';

import { useEffect, useState } from "react";

export default function Evaluations({ signalementId }) {
  const [evaluations, setEvaluations] = useState([]);

  // Effectuer une requête GET pour récupérer les évaluations
  useEffect(() => {
    async function fetchEvaluations() {
      const url = signalementId 
        ? `http://localhost/Devoi_socila_media/src/backend/api/evaluation/DisplayEvaluation.php?signalement_id=${signalementId}` 
        : "http://localhost/Devoi_socila_media/src/backend/api/evaluation/DisplayEvaluation.php";

      const response = await fetch(url); 
      const data = await response.json();
      // Vérifier si les évaluations sont présentes dans la réponse et les assigner
      if (data.status === "success" && Array.isArray(data.evaluations)) {
        setEvaluations(data.evaluations);
      } else {
        setEvaluations([]); // Si aucune évaluation n'est disponible, assignez un tableau vide
      }
    }

    fetchEvaluations();
  }, [signalementId]);

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <svg
          key={i}
          className={`h-5 w-5 ${i < rating ? "text-yellow-400" : "text-gray-300"}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M12 17.75l-5.94 3.12 1.13-6.56L2.29 9.78l6.66-.58L12 2.5l2.04 6.72 6.66.58-4.9 4.63 1.13 6.56L12 17.75z"
            clipRule="evenodd"
          />
        </svg>
      );
    }
    return stars;
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <h1 className="text-3xl font-semibold text-center mb-6">Évaluations</h1>
      <div className="w-full sm:grid-cols-2 lg:grid-cols-3">
        {/* Vérifier si "evaluations" est bien un tableau avant d'utiliser map */}
        {Array.isArray(evaluations) && evaluations.length > 0 ? (
          evaluations.map((evaluation) => (
            <div
              key={evaluation.id}
              className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition duration-300 ease-in-out"
            >
              <h2 className="text-xl font-bold mb-2">
                Signalement ID: {evaluation.signalement_id}
              </h2>
              <p className="text-gray-500 mb-4">
                <strong>Commentaire:</strong> {evaluation.comment || "Aucun commentaire"}
              </p>
              <div className="mb-4">
                <strong>Clarté:</strong>
                <div className="flex items-center space-x-1">
                  {renderStars(evaluation.clarity)}
                </div>
              </div>
              <div className="mb-4">
                <strong>Effectivité:</strong>
                <div className="flex items-center space-x-1">
                  {renderStars(evaluation.effectiveness)}
                </div>
              </div>
              <div className="mb-4">
                <strong>Temps de réponse:</strong>
                <div className="flex items-center space-x-1">
                  {renderStars(evaluation.response_time)}
                </div>
              </div>
              <div className="mb-4">
                <strong>Empathie:</strong>
                <div className="flex items-center space-x-1">
                  {renderStars(evaluation.empathy)}
                </div>
              </div>
              <p className="text-sm text-gray-400">
                Évalué faite le{" "}
                {new Date(evaluation.created_at).toLocaleDateString()}
              </p>
            </div>
          ))
        ) : (
          <p>Aucune évaluation disponible.</p>
        )}
      </div>
    </div>
  );
}
