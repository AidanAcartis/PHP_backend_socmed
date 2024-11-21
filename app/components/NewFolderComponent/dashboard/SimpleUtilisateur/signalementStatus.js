import { useEffect, useState } from 'react';

const Status = () => {
  const [signalements, setSignalements] = useState([]);

  useEffect(() => {
    // Récupérer les données depuis le backend
    fetch('http://localhost/Devoi_socila_media/src/backend/controllers/dasboard/getSecurityComplaints.php', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         // Si vous utilisez un jeton d'authentification
      },
      credentials: 'include', // Pour envoyer des cookies avec la requête, si nécessaire
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 'success') {
          setSignalements(data.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen bg-white flex justify-center items-center py-10 px-5">
      <div className="w-full max-w-5xl">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-12">Signalements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {signalements.length > 0 ? (
            signalements.map(signalement => (
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-2xl" key={signalement.id}>
                <h2 className="text-xl font-semibold text-white mb-2">{signalement.responsible_service}</h2>
                <p className="text-lg text-yellow-300 font-medium mb-4">{signalement.current_status}</p>
                <div className="text-white">
                  <p className="mb-2"><strong>Next Step:</strong> {signalement.next_step}</p>
                  <p className="mb-2"><strong>Next Date:</strong> {signalement.next_date}</p>
                  <p className="mb-2"><strong>Priority:</strong> {signalement.priority}</p>
                  <p className="mb-4"><strong>Description:</strong> {signalement.description}</p>
                </div>
                <p className="text-sm text-gray-300 text-right">Created at: {signalement.created_at}</p>
              </div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">No data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Status;
