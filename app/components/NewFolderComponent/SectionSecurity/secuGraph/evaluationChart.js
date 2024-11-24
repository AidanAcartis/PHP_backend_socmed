import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const EvaluationChart = () => {
    const [evaluationData, setEvaluationData] = useState([]);
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:3003/api/evaluations'); // Backend URL
                const data = await response.json();
                setEvaluationData(data);

                // Préparer les données pour le graphique
                const clarity = data.map(item => item.clarity);
                const effectiveness = data.map(item => item.effectiveness);
                const responseTime = data.map(item => item.response_time);
                const empathy = data.map(item => item.empathy);

                setChartData({
                    labels: data.map(item => `Signalement ${item.signalement_id}`),
                    datasets: [
                        {
                            label: 'Clarity',
                            data: clarity,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Effectiveness',
                            data: effectiveness,
                            backgroundColor: 'rgba(255, 99, 132, 0.2)',
                            borderColor: 'rgba(255, 99, 132, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Response Time',
                            data: responseTime,
                            backgroundColor: 'rgba(54, 162, 235, 0.2)',
                            borderColor: 'rgba(54, 162, 235, 1)',
                            borderWidth: 1,
                        },
                        {
                            label: 'Empathy',
                            data: empathy,
                            backgroundColor: 'rgba(255, 206, 86, 0.2)',
                            borderColor: 'rgba(255, 206, 86, 1)',
                            borderWidth: 1,
                        },
                    ],
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données des évaluations :', error);
            }
        };

        fetchData();
    }, []);

    if (!chartData) {
        return <div>Chargement des données...</div>;
    }

    return (
        <div>
            <h2>Statistiques des Évaluations</h2>
            <Bar data={chartData} options={{ responsive: true, plugins: { legend: { position: 'top' } } }} />
        </div>
    );
};

export default EvaluationChart;
