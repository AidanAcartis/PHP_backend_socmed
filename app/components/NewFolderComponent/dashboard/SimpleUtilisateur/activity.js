import { useState } from "react";

export default function EvaluationForm({ signalementId }) {
  const [formData, setFormData] = useState({
    clarity: 0,
    effectiveness: 0,
    response_time: 0,
    empathy: 0,
    comment: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost/Devoi_socila_media/src/backend/api/evaluation/evaluation.php", {
      method: "POST",
      credentials:"include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, signalement_id: signalementId }),
    });
    if (response.ok) {
      alert("Évaluation soumise avec succès !");
    } else {
      alert("Erreur lors de l'envoi de l'évaluation.");
    }
  };

  return (
    <form 
  onSubmit={handleSubmit} 
  className="max-w-xl mx-auto bg-white shadow-lg rounded-lg p-8 space-y-6"
>
  <h3 className="text-2xl font-bold text-gray-800 text-center">Évaluation de l'aide reçue</h3>

  <div>
    <label 
      className="block text-sm font-medium text-gray-600 mb-2"
    >
      Clarté de la communication :
    </label>
    <input
      type="number"
      name="clarity"
      min="1"
      max="5"
      value={formData.clarity}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label 
      className="block text-sm font-medium text-gray-600 mb-2"
    >
      Efficacité de l’intervention :
    </label>
    <input
      type="number"
      name="effectiveness"
      min="1"
      max="5"
      value={formData.effectiveness}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label 
      className="block text-sm font-medium text-gray-600 mb-2"
    >
      Temps de réponse :
    </label>
    <input
      type="number"
      name="response_time"
      min="1"
      max="5"
      value={formData.response_time}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label 
      className="block text-sm font-medium text-gray-600 mb-2"
    >
      Soutien émotionnel :
    </label>
    <input
      type="number"
      name="empathy"
      min="1"
      max="5"
      value={formData.empathy}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>

  <div>
    <label 
      className="block text-sm font-medium text-gray-600 mb-2"
    >
      Commentaire :
    </label>
    <textarea
      name="comment"
      value={formData.comment}
      onChange={handleChange}
      required
      className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
      rows="4"
    ></textarea>
  </div>

  <button 
    type="submit" 
    className="w-full bg-blue-600 text-white text-lg font-medium py-2 rounded-lg hover:bg-blue-700 transition duration-300"
  >
    Soumettre l’évaluation
  </button>
</form>

  );
}
