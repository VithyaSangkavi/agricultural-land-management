import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './report.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

ChartJS.register(...registerables);

const CostBreakdownReport = ({ dateRange: { fromDate }, selectedLand }) => {
    const [costBreakdownLineData, setCostBreakdownLineData] = useState([]);
    const [costBreakdownPieData, setCostBreakdownPieData] = useState([]);
    const [landId, setLandId] = useState('');

    useEffect(() => {
        // Update the landId whenever selectedLand changes
        axios.post(`http://localhost:8080/service/master/findLandIdByName?name=${selectedLand}`)
            .then((response) => {
                const landIdTask = response.data.extra;
                const taskLand = JSON.stringify(landIdTask);
                const landData = JSON.parse(taskLand);
                const newLandId = landData.landId;
                console.log('Selected Land Id:', newLandId);
                localStorage.setItem('SelectedLandId', newLandId);
                setLandId(newLandId);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, [selectedLand]);

    console.log("Cost-b-down land: ", landId)
    console.log("Cost-b-down fromDate: ", fromDate)

    useEffect(() => {
        const fetchCostBreakdownLineData = async () => {
            try {

                const baseURL = 'http://localhost:8080/service/master/cost-breakdown-line'

                if (landId) {
                    if (fromDate) {

                        const fetchURL = `${baseURL}?fromDate=${fromDate}&landId=${landId}`
                        const response = await axios.get(fetchURL)
                        console.log("Line : ", response.data);
                        setCostBreakdownLineData(response.data);

                    } else {

                        const fetchURL = `${baseURL}?landId=${landId}`
                        const response = await axios.get(fetchURL)
                        console.log("Line : ", response.data);
                        setCostBreakdownLineData(response.data);

                    }

                } else {

                    const fetchURL = fromDate ? `${baseURL}?fromDate=${fromDate}` : baseURL;
                    const response = await axios.get(fetchURL)
                    console.log("Line : ", response.data);
                    setCostBreakdownLineData(response.data);

                }

            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        const fetchCostBreakdownPieData = async () => {
            try {
                const response = await axios.get('http://localhost:8080/service/master/cost-breakdown-pie');
                console.log("Pie : ", response.data);
                setCostBreakdownPieData(response.data);
            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        fetchCostBreakdownLineData();
        fetchCostBreakdownPieData();
    }, [fromDate, landId]);

    costBreakdownLineData.forEach((item) => {
        item.totalCost = parseFloat(item.totalCost);
    });

    const uniqueMonths = [...new Set(costBreakdownLineData.map((item) => item.yearMonth))];

    const chartData = {
        labels: uniqueMonths,
        datasets: [...new Set(costBreakdownLineData.map((item) => item.expenseType))].map((expenseType, index) => ({
            label: expenseType,
            data: costBreakdownLineData
                .filter((item) => item.expenseType === expenseType)
                .map((item) => ({ x: item.yearMonth, y: item.totalCost })),
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
