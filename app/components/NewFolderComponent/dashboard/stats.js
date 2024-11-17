// components/Banner.js
export default function StatsForm() {
    return (
      <div>
            {/* Statistiques */}
<section className="mt-8">
  <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
    <span className="bg-gray-200"><span>📊</span>Statistiques</span>
  </h2>
  <div className="bg-white p-6 rounded-lg shadow-lg mt-4 border-l-4 border-indigo-600">
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">Total de Signalements</h3>
        <p className="text-3xl font-bold text-indigo-600">7</p>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">Signalements par Statut</h3>
        <p className="text-lg text-gray-600">🔵 Reçu: 1</p>
        <p className="text-lg text-yellow-600">🟡 En vérification: 1</p>
        <p className="text-lg text-green-600">🟢 Résolu: 1</p>
        <p className="text-lg text-gray-600">🟠 Complément demandé: 1</p>
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-700">Priorité des Cas</h3>
        <p className="text-lg text-red-600">🔴 Haute</p>
        <p className="text-lg text-yellow-500">🟡 Moyenne</p>
        <p className="text-lg text-green-500">🟢 Faible</p>
      </div>
    </div>
  </div>
</section>

      </div>
    );
}
