import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import './report.css'

ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale);

const MonthlyCropReport = () => {
    const [monthlyCropData, setMonthlyCropData] = useState([]);

    useEffect(() => {
        const fetchMonthlyCropReport = async () => {
            try {
                const response = await axios.get('http://localhost:8081/service/master/monthly-crop-report');
                setMonthlyCropData(response.data);
            } catch (error) {
                console.error('Error fetching monthly crop report:', error);
            }
        };

        fetchMonthlyCropReport();
    }, []);

    const chartData = {
        labels: Object.keys(monthlyCropData),
        datasets: [
            {
                label: 'Past Year Quantity',
                data: Object.values(monthlyCropData).map(data => data[0].PastYearTotalQuantity),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
            {
                label: 'Current Year Quantity',
                data: Object.values(monthlyCropData).map(data => data[0].CurrentYearTotalQuantity),
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
                pointRadius: 0,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'category',
                title: {
                    display: true,
                    text: 'Month',
                },
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity',
                },
                ticks: {
                    stepSize: 50,
                },
            },
        },
    };

    return (
        <>
            <div className='report-app-screen'>
                <h2>Monthly Crop Report</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Past Year Quantity</th>
                            <th>Current Year Quantity</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(monthlyCropData).map(([month, data]) => (
                            <tr key={month}>
                                <td>{month}</td>
                                <td>{data[0].PastYearTotalQuantity}</td>
                                <td>{data[0].CurrentYearTotalQuantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='monthly-crop-chart'>
                    <h2>Monthly Crop Comparison Chart</h2>
                    {Object.keys(monthlyCropData).length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <p>Loading...</p>
                    )}

                </div>

            </div>
            <br />
        </>
    );
};

export default MonthlyCropReport;
