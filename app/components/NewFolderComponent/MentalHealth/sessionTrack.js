export default function SessionTracking() {
    return (
      <div className="p-6 border rounded-xl shadow-lg bg-gradient-to-r from-pink-100 via-purple-50 to-blue-100">
      <h2 className="text-3xl font-semibold text-purple-800 mb-2">Suivi des séances de thérapie</h2>
      <div className="mt-5 space-y-6">
        <div className="flex justify-between text-purple-600">
          <span className="font-medium">Date: 12/11/2024</span>
          <span className="font-medium">Durée: 50 min</span>
        </div>
        <p className="text-purple-700">Résumé: Séance de suivi psychologique sur la gestion du stress.</p>
        <div className="flex justify-between items-center">
          <span className="text-purple-600 font-medium">Note d'efficacité</span>
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => (
              <span key={index} className="text-yellow-500 text-lg">★</span>
            ))}
          </div>
        </div>
      </div>
    </div>
    );
  }
  