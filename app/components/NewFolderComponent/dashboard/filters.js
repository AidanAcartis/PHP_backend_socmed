// components/Filters.js

const Filters = () => {
    return (
      <section className="bg-white p-6 rounded-lg shadow-lg mt-6">
        <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
          <span>🔍</span>
          <span>Filtres</span>
        </h2>
        <div className="mt-6 space-y-6">
          {/* Statut Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Statut</label>
            <select className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
              {/*
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
              */}
            </select>
          </div>
  
          {/* Date Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date</label>
            <input 
              type="date" 
              className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300" 
            />
          </div>
  
          {/* Priorité Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Priorité</label>
            <select className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300">
              <option>Faible</option>
              <option>Moyenne</option>
              <option>Haute</option>
            </select>
          </div>
        </div>
      </section>
    );
  };
  
  export default Filters;
  
