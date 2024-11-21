import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const statusMapping = {
  "Reçu": 0,
  "En vérification": 1,
  "En attente de documents": 2,
  "Assigné": 3,
  "En cours de traitement": 4,
  "En attente de résolution": 5,
  "Reporté": 6,
  "Résolu": 7,
  "Rejeté": 8,
  "En appel": 9,
  "Escalade": 10,
  "Clôturé": 11,
};

const statusLabels = [
  "Reçu",
  "En vérification",
  "En attente de documents",
  "Assigné",
  "En cours de traitement",
  "En attente de résolution",
  "Reporté",
  "Résolu",
  "Rejeté",
  "En appel",
  "Escalade",
  "Clôturé",
];

const StatusChart = ({ signalementId }) => {
  const [data, setData] = useState([]); // Initialisez data comme un tableau vide
  const [chartData, setChartData] = useState({
    labels: [], // Labels pour l'axe X
    datasets: [
      {
        label: 'Historique des statuts',
        data: [], // Données pour l'axe Y
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Tentative de récupération des données...');
        const response = await fetch(`http://localhost:3003/api/status-history/${signalementId}`);
        const result = await response.json();
        console.log('Données récupérées:', result);

        if (Array.isArray(result) && result.length > 0) {
          const dates = result.map(item => item.change_date);
          const statusCodes = result.map(item => statusMapping[item.new_status]);

          setData(result); // Met à jour les données

          setChartData({
            labels: dates,
            datasets: [
              {
                label: 'Historique des statuts',
                data: statusCodes, // Utiliser les codes de statut
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
              },
            ],
          });
        } else {
          console.log('Aucune donnée trouvée.');
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données :', error);
      }
    };

    fetchData();
  }, [signalementId]); // L'effet se déclenche lorsque signalementId change

  // Modifier la configuration pour afficher les légendes sur l'axe Y
  const options = {
    scales: {
      y: {
        ticks: {
          callback: function (value) {
            return statusLabels[value]; // Afficher le nom du statut en utilisant statusLabels
          },
        },
        // Option pour adapter l'échelle
        min: 0,
        max: 11,
        stepSize: 1,
      },
    },
  };

  return (
    <div>
      <h2>Historique des statuts pour le signalement {signalementId}</h2>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default StatusChart;
