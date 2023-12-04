import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './report.css'
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale, BarElement } from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(LineElement, BarElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale);

const CostYieldReport = () => {
    const [costYieldData, setCostYieldData] = useState({});

    useEffect(() => {
        const fetchCostYieldData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/service/master/other-cost-yield');
                setCostYieldData(response.data);
            } catch (error) {
                console.error('Error fetching cost-yield report:', error);
            }
        };

        fetchCostYieldData();
    }, []);

    const chartData = {
        labels: Object.keys(costYieldData),
        datasets: [
            {
                label: 'Cost',
                data: Object.values(costYieldData).map(data => data.Cost),
                backgroundColor: 'rgba(75, 192, 192, 0.5)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
            {
                label: 'Yield',
                data: Object.values(costYieldData).map(data => data.Yield),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        indexAxis: 'x',
        grouped: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Amount',
                },
                ticks: {
                    stepSize: 50000,
                },
            },
        },
    };

    return (
        <>
            <br />
            <div className='report-app-screen'>
                <h2>Cost Yield Report</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Cost</th>
                            <th>Yield</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(costYieldData).map((month, index) => (
                            <tr key={index}>
                                <td>{month}</td>
                                <td>{costYieldData[month].Cost}</td>
                                <td>{costYieldData[month].Yield}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='bar-chart'>
                    <h2>Cost vs Yield Comparison Chart</h2>
                    {Object.keys(costYieldData).length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <br />
        </>
    );
};

export default CostYieldReport;
