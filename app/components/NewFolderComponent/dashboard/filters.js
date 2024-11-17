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
              <option>🔵 Reçu</option>
              <option>🟡 En cours de vérification</option>
              <option>🟠 Complément demandé</option>
              <option>🟢 En cours de traitement</option>
              <option>🟣 Transmis aux autorités</option>
              <option>⚫ Archivé</option>
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
  