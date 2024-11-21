import { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";

const ReportsByPersonChart = () => {
const [data, setData] = useState(null);

useEffect(() => {
  fetch("http://localhost:3003/api/reports-by-person")
    .then((response) => response.json())
    .then((data) => setData(data));
}, []);

if (!data) return <p>Chargement...</p>;

const chartData = {
  labels: data.map((item) => item.full_name),
  datasets: [
    {
      data: data.map((item) => item.count),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
    },
  ],
};

return (
  <div>
    <h2>Nombre de signalements par personne</h2>
    <Pie data={chartData} />
  </div>
);
};

export default ReportsByPersonChart;