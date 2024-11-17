// components/EngagementSection.js
export default function EngagementSection() {
    return (
      <section className="bg-gray-800 p-4 rounded-lg mb-5">
        <h3 className="text-lg font-semibold">Engagement et Activité</h3>
        <ul className="mt-2 space-y-1">
          <li className="text-gray-400">Article lu : Comment gérer le stress</li>
          <li className="text-gray-400">Vidéo visionnée : Techniques de respiration</li>
        </ul>
        <div className="mt-3 p-2 bg-gray-700 rounded">Badge : Contributeur Actif</div>
      </section>
    );
  }