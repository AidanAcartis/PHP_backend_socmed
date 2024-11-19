'use client';
import { useState } from "react";

export default function SecurityComplaintForm() {
  const [status, setStatus] = useState("reçu");
  const [nextStep, setNextStep] = useState("");

  const statuses = [
    { label: "Reçu", color: "bg-blue-500" },
    { label: "En vérification", color: "bg-yellow-500" },
    { label: "En attente de résolution", color: "bg-orange-500" },
    { label: "Résolu", color: "bg-green-500" },
  ];

  return (
    <div>
      <div className="flex flex-col space-y-2">
          <label htmlFor="responsible" className="text-xl font-semibold">Service responsable</label>
          <input
            id="responsible"
            type="text"
            placeholder="Nom du service"
            className="p-2 rounded-lg bg-gray-100 border border-gray-500"
          />
        </div>
      {/* Prochaines étapes */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Prochaines étapes</h2>
        <form className="space-y-3">
          <div className="flex flex-col space-y-2">
            <label htmlFor="next-step" className="font-medium">Étape suivante</label>
            <select
              id="next-step"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-48"
              value={nextStep}
              onChange={(e) => setNextStep(e.target.value)}
            >
              <option value="">Sélectionner...</option>
              <option value="enquete">Enquête</option>
              <option value="interview">Interview</option>
              <option value="audience">Audience au tribunal</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="flex flex-col space-y-2">
            <label htmlFor="next-date" className="font-medium">Date prévue</label>
            <input
              id="next-date"
              type="date"
              className="p-2 rounded-lg bg-gray-100 border border-gray-500 w-48"
            />
          </div>
        </form>
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
      {/* Communication avec la victime */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Communication avec la victime</h2>
        <div className="flex space-x-4 gap-10">
          <button className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
            </svg>
            <span className="hidden md:block">Messenger</span>
          </button>
          <button className="p-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z" />
            </svg>
            <span className="hidden md:block">Call</span>
          </button>
        </div>
      </section>
    </div>
  );
}
