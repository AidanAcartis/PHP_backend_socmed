import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
// Importer les composants nécessaires de Chart.js
import { Chart as ChartJS, CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Enregistrer les composants nécessaires, y compris ArcElement pour les graphiques circulaires
ChartJS.register(CategoryScale, BarElement, LinearScale, Title, Tooltip, Legend, ArcElement);

const GeographicDistributionChart = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3003/api/geographic-distribution")
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <p>Chargement...</p>;

  const chartData = {
    labels: data.map((item) => item.location),
    datasets: [
      {
        label: "Nombre de signalements",
        data: data.map((item) => item.count),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return (
    <div>
      <h2>Répartition des signalements par région</h2>
      <Bar data={chartData} />
    </div>
  );
};

export default GeographicDistributionChart;
