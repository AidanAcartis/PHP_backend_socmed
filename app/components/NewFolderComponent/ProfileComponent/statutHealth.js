// components/Dashboard.js
export default function StatutHealth() {
    return (
      <section className="bg-gray-800 p-4 rounded-lg mb-5">
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Statut de Santé Mentale</h3>
          <canvas id="moodChart" className="w-full mt-2 bg-gray-900 rounded"></canvas>
        </div>
        <div>
          <h3 className="text-lg font-semibold">Suivi des Objectifs</h3>
          <div className="h-4 bg-gray-700 rounded mt-2">Progress Bar</div>
        </div>
      </section>
    );
  }