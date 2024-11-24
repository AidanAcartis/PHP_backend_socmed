import { useEffect, useState } from "react";

const ProofList = () => {
  const [proofs, setProofs] = useState([]);

  useEffect(() => {
    const fetchProofs = async () => {
      try {
        const response = await fetch(
          `http://localhost/Devoi_socila_media/src/backend/api/Proofs/displayProof.php`
        );
        const data = await response.json();
        setProofs(data.data || []);
      } catch (error) {
        console.error("Erreur lors de la récupération des preuves :", error);
      }
    };

    fetchProofs();
  }, []);

  const deleteProof = async (proofId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce signalement ?")) {
        return;
    }

    try {
        const response = await fetch(
            'http://localhost/Devoi_socila_media/src/backend/api/Proofs/deleteProof.php',
            {
                method: 'POST', // Correspond à la méthode attendue par le backend
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: proofId }), // Transmettre l'ID au backend
            }
        );

        const result = await response.json();
        console.log('the ID:', result);

        if (result.status === 'success') {
            // Filtrer la liste des preuves pour supprimer celle ayant le proofId
            setProofs((prev) => prev.filter((proof) => proof.id !== proofId));
            alert("Signalement supprimé avec succès.");
        } else {
            console.error("Erreur lors de la suppression :", result.message);
        }
    } catch (error) {
        console.error("Erreur réseau :", error);
    }
};

  const groupedProofs = proofs.reduce((acc, proof) => {
    acc[proof.signalement_id] = acc[proof.signalement_id] || [];
    acc[proof.signalement_id].push(proof);
    return acc;
  }, {});

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800">Preuves soumises</h3>
      {Object.entries(groupedProofs).map(([signalementId, proofList]) => (
        <div key={signalementId} className="mt-6">
          <h4 className="text-lg font-semibold text-gray-700">
            Signalement #{signalementId}
          </h4>
          <table className="min-w-full mt-2 table-auto border-collapse border border-gray-300">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Nom du fichier</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Créé le</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {proofList.map((proof) => (
                <tr key={proof.id}>
                  <td className="px-4 py-2 border">
                    <a
                      href={proof.file_path}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      {proof.file_path.split("/").pop()}
                    </a>
                  </td>
                  <td className="px-4 py-2 border">{proof.file_type}</td>
                  <td className="px-4 py-2 border">
                    {new Date(proof.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 border">
                    <a
                      href={proof.file_path}
                      download
                      className="text-green-500 mr-4"
                    >
                      📥 Télécharger
                    </a>
                    <button
                        onClick={() => deleteProof(proof.id)}
                        className="text-red-500 hover:text-red-700 focus:outline-none transition-all"
                      >
                      🗑️ Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ProofList;
