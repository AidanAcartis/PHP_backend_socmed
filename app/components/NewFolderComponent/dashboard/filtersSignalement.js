import React, { useState, useEffect } from 'react';

// Composant des filtres
const Filters = ({ onFilterChange }) => {
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [priority, setPriority] = useState('');

  const handleFilterChange = () => {
    onFilterChange({ status, date, priority });
  };

  useEffect(() => {
    handleFilterChange();
  }, [status, date, priority]);

  return (
    <section className="bg-white p-6 rounded-lg shadow-lg mt-6">
      <h2 className="text-2xl font-semibold text-gray-900 flex items-center space-x-2">
        <span>🔍</span>
        <span>Filtres</span>
      </h2>
      <div className="mt-6 space-y-6">
        {/* Filtre Statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Statut</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          >
            <option value="">Tous</option>
            <option value="Reçu">Reçu</option>
            <option value="En appel">En appel</option>
            <option value="En attente de résolution">En attente de résolution</option>
            <option value="Clôturé">Clôturé</option>
            <option value="Assigné">Assigné</option>
          </select>
        </div>

        {/* Filtre Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          />
        </div>

        {/* Filtre Priorité */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Priorité</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="mt-2 block w-full bg-gray-50 border border-gray-300 text-gray-700 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300"
          >
            <option value="">Tous</option>
            <option value="faible">Faible</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>
      </div>
    </section>
  );
};

// Composant principal
const ComplaintsBoard = () => {
  const [complaints, setComplaints] = useState([]);
  const [filteredComplaints, setFilteredComplaints] = useState([]);

  const statuses = [
    { label: 'Reçu', color: 'bg-blue-500' },
    { label: 'En appel', color: 'bg-pink-500' },
    { label: 'En attente de résolution', color: 'bg-orange-500' },
    { label: 'Clôturé', color: 'bg-green-700' },
    { label: 'Assigné', color: 'bg-teal-500' },
  ];

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          'http://localhost/Devoi_socila_media/src/backend/api/signalement/signalementBoard.php'
        );
        if (!response.ok) throw new Error('Réponse du serveur incorrecte');
        const data = await response.json();
        if (data.status === 'success' && Array.isArray(data.data)) {
          setComplaints(data.data);
          setFilteredComplaints(data.data);
        } else {
          console.error('Données non valides');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchComplaints();
  }, []);

  const handleFilterChange = (filters) => {
    const { status, date, priority } = filters;

    const filteredData = complaints.filter((item) => {
      const matchesStatus = !status || item.current_status.toLowerCase() === status.toLowerCase();
      const matchesDate = !date || item.date === date;
      const matchesPriority = !priority || item.priority.toLowerCase() === priority.toLowerCase();
      return matchesStatus && matchesDate && matchesPriority;
    });

    setFilteredComplaints(filteredData);
  };

  return (
    <div className="p-6">
      <Filters onFilterChange={handleFilterChange} />
      <section className="mt-6">
        <h2 className="text-2xl font-semibold text-gray-900">Signalements</h2>
        <div className="mt-4 space-y-4">
        {filteredComplaints.length > 0 ? (
  <table className="min-w-full table-auto bg-white rounded-lg shadow-lg overflow-hidden">
    <thead className="bg-indigo-50 border-b border-gray-200">
      <tr>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Statut</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Résumé</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Priorité</th>
        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Responsable</th>
      </tr>
    </thead>
    <tbody>
      {filteredComplaints.map((complaint) => {
        const status = statuses.find(
          (status) => status.label === complaint.current_status
        );
        return (
          <tr key={complaint.id} className="border-b">
            <td className="py-3 px-4 flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${status ? status.color : 'bg-gray-300'}`}></div>
              {complaint.current_status}
            </td>
            <td className="py-3 px-4 text-sm">{complaint.date}</td>
            <td className="py-3 px-4 text-sm">{complaint.description.substring(0, 30)}...</td>
            <td className="py-3 px-4 text-sm">{complaint.priority}</td>
            <td className="py-3 px-4 text-sm">{complaint.responsible_service}</td>
          </tr>
        );
      })}
    </tbody>
  </table>
) : (
  <p className="text-gray-600">Aucune plainte filtrée trouvée.</p>
)}
        </div>
      </section>
    </div>
  );
};

export default ComplaintsBoard;
