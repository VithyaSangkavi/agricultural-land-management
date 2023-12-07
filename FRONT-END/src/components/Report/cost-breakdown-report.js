import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './report.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

ChartJS.register(...registerables);

const CostBreakdownReport = () => {
    const [costBreakdownLineData, setCostBreakdownLineData] = useState([]);
    const [costBreakdownPieData, setCostBreakdownPieData] = useState([]);

    useEffect(() => {
        const fetchCostBreakdownLineData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/service/master/cost-breakdown-line');
                console.log("Line : ", response.data);
                setCostBreakdownLineData(response.data);
            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        const fetchCostBreakdownPieData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/service/master/cost-breakdown-pie');
                console.log("Pie : ", response.data);
                setCostBreakdownPieData(response.data);
            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        fetchCostBreakdownLineData();
        fetchCostBreakdownPieData();
    }, []);

    costBreakdownLineData.forEach((item) => {
        item.totalCost = parseFloat(item.totalCost);
    });

    const uniqueMonths = [...new Set(costBreakdownLineData.map((item) => item.month))];

    const chartData = {
        labels: uniqueMonths,
        datasets: [...new Set(costBreakdownLineData.map((item) => item.expenseType))].map((expenseType, index) => ({
            label: expenseType,
            data: costBreakdownLineData
                .filter((item) => item.expenseType === expenseType)
                .map((item) => ({ x: item.month, y: item.totalCost })),
            fill: false,
            borderColor: `rgba(${index * 100}, 0, 0, 1)`,
            borderWidth: 2,
            lineTension: 0.1,
        })),
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
                    text: 'Cost',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    // pie chart

    const uniqueColors = generateRandomColors(costBreakdownPieData.length);

    const totalCosts = costBreakdownPieData.map((item) => parseFloat(item.totalCost));
    const total = totalCosts.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    const pieChartData = {
        labels: costBreakdownPieData.map((item) => {
            const percentage = ((parseFloat(item.totalCost) / total) * 100).toFixed(2);
            return `${item.expenseType}: ${percentage}%`;
        }),
        datasets: [
            {
                data: totalCosts,
                backgroundColor: uniqueColors,
                hoverBackgroundColor: uniqueColors,
            },
        ],
    };


    // Function to generate random colors
    function generateRandomColors(numColors) {
        const colors = [];
        for (let i = 0; i < numColors; i++) {
            const color = `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(
                Math.random() * 256
            )}, ${Math.floor(Math.random() * 256)}, 0.7)`;
            colors.push(color);
        }
        return colors;
    }

    return (
        <>
            <div className='report-app-screen'>
                <h2>Cost Breakdown Line Chart</h2>
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='attendance-chart'>
                    {costBreakdownLineData.length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
            <br />
            <div className='report-app-screen'>
                <h2>Cost Breakdown Pie Chart</h2>
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='attendance-chart'>
                    {costBreakdownPieData.length > 0 ? (
                        <Pie data={pieChartData} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default CostBreakdownReport;
