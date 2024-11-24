import { useState, useEffect } from "react";

const ProofSection = () => {
  const [complaints, setComplaints] = useState([]);
  const [files, setFiles] = useState({});
  const [message, setMessage] = useState("");

  // Fetch complaints data
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await fetch(
          'http://localhost/Devoi_socila_media/src/backend/api/Proofs/Myproof.php',
          {
            method: 'GET',
            credentials: 'include'  // Important pour envoyer les cookies de session
          }
        );

        if (!response.ok) {
          throw new Error(`Erreur ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.status === 'success' && Array.isArray(data.signalements)) {
          setComplaints(data.signalements);
        } else {
          console.error('Données non valides ou aucun signalement trouvé');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        setMessage(`Erreur lors de la récupération des données: ${error.message}`);
      }
    };

    fetchComplaints();
  }, []);

  // Handle file selection
  const handleFileChange = (signalementId, e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prevFiles => ({ ...prevFiles, [signalementId]: selectedFiles }));
  };

  // Handle file upload
  const handleFileUpload = async (signalementId) => {
    const formData = new FormData();
    const selectedFiles = files[signalementId] || [];
    selectedFiles.forEach((file) => formData.append("proofs[]", file)); // Assurez-vous que le nom du champ est "proofs[]"
  
    try {
      const response = await fetch(
        `http://localhost/Devoi_socila_media/src/backend/api/Proofs/proofUpload.php?id=${signalementId}`,
        {
          method: "POST",
          credentials: "include",  // Important pour envoyer les cookies de session
          body: formData,
        }
      );
  
      const result = await response.json();
      if (result.status === 'success') {
        setMessage("Fichiers téléchargés avec succès!");
        setFiles(prevFiles => ({ ...prevFiles, [signalementId]: [] })); // Clear files after upload for this signalement
      } else {
        setMessage("Erreur lors du téléchargement.");
      }
    } catch (error) {
      setMessage("Erreur lors de l'envoi.");
      console.error(error);
    }
  };
  

  return (
    <section className="bg-white p-8 rounded-lg shadow-xl mt-8 space-y-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Preuves pour la plainte</h2>
        <p className="text-lg text-gray-600">
          Veuillez télécharger les preuves pertinentes pour votre plainte. Vous
          pouvez télécharger plusieurs fichiers.
        </p>
      </div>

      {complaints.length > 0 ? (
        complaints.map((complaint) => (
          <div key={complaint.id} className="mt-6">
            <div className="space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">
                {complaint.description} - {complaint.current_status}
              </h3>
              <p className="text-gray-600">
                Date : {complaint.date} | Priorité : {complaint.priority}
              </p>
              <p className="text-gray-600">Responsable : {complaint.responsible_service}</p>
            </div>

            <div className="mt-3">
              <label className="block text-sm font-medium text-gray-700">Ajouter des preuves</label>
              <input
                type="file"
                className="block w-full text-sm text-gray-600 file:mr-4 file:py-3 file:px-5 file:rounded-xl file:border file:border-gray-300 file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                multiple
                onChange={(e) => handleFileChange(complaint.id, e)}
              />
            </div>
            <button
              onClick={() => handleFileUpload(complaint.id)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Télécharger les preuves
            </button>
          </div>
        ))
      ) : (
        <p className="text-gray-500">Aucun signalement trouvé.</p>
      )}

      {message && <p className="text-gray-500 mt-4">{message}</p>}
    </section>
  );
};

export default ProofSection;
