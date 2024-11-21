'use client';
import { useState } from "react";

export default function SecurityComplaintForm({ signalementId }) {
  const [status, setStatus] = useState("reçu");
  const [nextStep, setNextStep] = useState("");
  const [nextDate, setNextDate] = useState("");
  const [serviceComments, setServiceComments] = useState(""); // Nouvel état pour les commentaires
  const [responsibleService, setResponsibleService] = useState(""); // Service responsable
  const [priority, setPriority] = useState("moyenne"); // Valeur par défaut

  const statuses = [
    { label: "Reçu", color: "bg-blue-500" },
    { label: "En vérification", color: "bg-yellow-500" },
    { label: "En attente de documents", color: "bg-indigo-500" },
    { label: "Assigné", color: "bg-teal-500" },
    { label: "En cours de traitement", color: "bg-purple-500" },
    { label: "En attente de résolution", color: "bg-orange-500" },
    { label: "Reporté", color: "bg-gray-500" },
    { label: "Résolu", color: "bg-green-500" },
    { label: "Rejeté", color: "bg-red-500" },
    { label: "En appel", color: "bg-pink-500" },
    { label: "Escalade", color: "bg-red-700" },
    { label: "Clôturé", color: "bg-green-700" }
  ]
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Créer l'objet de données à envoyer
    const formData = {
      signalement_id: signalementId,
      responsible_service: responsibleService,
      next_step: nextStep,
      next_date: nextDate,
      current_status: status,
      service_comments: serviceComments,
      priority: priority,
    };

    // Envoi des données au backend PHP via une requête POST
    try {
      const response = await fetch("http://localhost/Devoi_socila_media/src/backend/api/signalement/securityComplaints.php", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      console.log('les donnees a envoyees:', formData);

      if (response.ok) {
        console.log("Données envoyées avec succès");
      } else {
        console.error("Erreur lors de l'envoi des données");
      }
    } catch (error) {
      console.error("Erreur réseau:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label htmlFor="responsible" className="text-xl font-semibold">Service responsable</label>
          <input
            id="responsible"
            type="text"
            placeholder="Nom du service"
            className="p-2 rounded-lg bg-gray-100 border border-gray-500"
            value={responsibleService}
            onChange={(e) => setResponsibleService(e.target.value)}
          />
        </div>
        <div className="mb-4">
        <label className="block text-sm font-semibold text-gray-600">Priorité</label>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
        >
          <option value="haute">Haute</option>
          <option value="moyenne">Moyenne</option>
          <option value="faible">Faible</option>
        </select>
      </div>

        {/* Prochaines étapes */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Prochaines étapes</h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="next-step" className="font-medium">Étape suivante</label>
            <select
              id="next-step"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-48"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
            >
              <option value="">Sélectionner...</option>
              <option value="enquete">Enquête en cours</option>
              <option value="appel_a_temoin">Appel à témoins</option>
              <option value="interview">Convocation pour une interview</option>
              <option value="audience">Audience prévue au tribunal</option>
              <option value="confrontation_programmee">Confrontation programmée</option>
              <option value="transmission_dossier">Transmission du dossier au tribunal</option>
              <option value="cloture_enquete">Clôture de l'enquête</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="next-date" className="font-medium">Date prévue</label>
            <input
              id="next-date"
              type="date"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-48"
              value={nextDate}
              onChange={(e) => setNextDate(e.target.value)}
            />
          </div>
        </section>

        {/* Statut et responsable */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Statut de l'affaire</h2>
          <div className="flex flex-col space-y-2">
            <label htmlFor="status" className="font-medium">Statut actuel</label>
            <select
              id="status"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              {statuses.map((s) => (
                <option key={s.label} value={s.label}>{s.label}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <span className={`w-4 h-4 rounded-full ${statuses.find((s) => s.label === status)?.color}`}></span>
            <span>{status}</span>
          </div>
        </section>

        {/* Section pour les commentaires du service */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Commentaires du service</h2>
          <div className="flex flex-col space-y-2">
            <textarea
              id="service-comments"
              rows="4"
              placeholder="Entrez les commentaires du service ici..."
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-50 h-20"
              value={serviceComments}
              onChange={(e) => setServiceComments(e.target.value)} // Gérer le changement des commentaires
            />
          </div>
        </section>

        <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg">Soumettre</button>
      </form>
    </div>
  );
}
