// components/IncidentTable.js

const IncidentTable = () => {
    const incidents = [
      { id: 1, status: '🔵 Reçu', date: '12/11/24', summary: 'Harcèlement verbal...', action: 'Voir', priority: 'Haute', responsible: 'Jean Dupont' },
      { id: 2, status: '🟡 En cours de vérification', date: '11/11/24', summary: 'Incident au travail...', action: 'Voir', priority: 'Moyenne', responsible: 'Marie Lemoine' },
      { id: 3, status: '🟠 Complément demandé', date: '10/11/24', summary: 'Discrimination...', action: 'Voir', priority: 'Haute', responsible: 'Marc Robert' },
    ];
  
    return (
      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full table-auto bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-indigo-50 border-b border-gray-200">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Résumé</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priorité</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Responsable</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b hover:bg-indigo-50 transition-colors duration-300">
                <td className="px-6 py-4 text-sm text-gray-700">{incident.status}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{incident.date}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{incident.summary}</td>
                <td className="px-6 py-4 text-sm text-indigo-600 font-medium cursor-pointer hover:text-indigo-800 transition-colors duration-300">{incident.action}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{incident.priority}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{incident.responsible}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default IncidentTable;
  