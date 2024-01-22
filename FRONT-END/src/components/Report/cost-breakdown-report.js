import React, { useState, useEffect } from 'react';
import './report.css';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';

ChartJS.register(...registerables);

const CostBreakdownReport = ({ fromDate, selectedLand }) => {
    const [costBreakdownLineData, setCostBreakdownLineData] = useState([]);
    const [costBreakdownPieData, setCostBreakdownPieData] = useState([]);
    const [yearMonth, setYearMonth] = useState('');


    console.log("Cost-b-down land: ", selectedLand)

    console.log("Cost-b-down fromDate: ", fromDate)

    if (fromDate === `1970-01-01`) {
        fromDate = null;
    }

    console.log("Cost-b-down fromDate 1: ", fromDate)

    useEffect(() => {
        const fetchCostBreakdownLineData = async () => {
            try {

                if (selectedLand) {
                    if (fromDate) {

                        const response = await submitSets(submitCollection.cost_breakdown_line, "?fromDate=" + fromDate + '&landId=' + selectedLand, true)
                        console.log("Line : ", response);
                        setCostBreakdownLineData(response);
                        setYearMonth(response)

                    } else {

                        const response = await submitSets(submitCollection.cost_breakdown_line, '?landId=' + selectedLand, true)
                        console.log("Line : ", response);
                        setCostBreakdownLineData(response);

                    }

                } else {

                    if (fromDate) {

                        const response = await submitSets(submitCollection.cost_breakdown_line, "?fromDate=" + fromDate, true)
                        console.log("Line : ", response);
                        setCostBreakdownLineData(response);
                        setYearMonth(response)

                    } else {

                        const response = await submitSets(submitCollection.cost_breakdown_line, false)
                        console.log("Line : ", response);
                        setCostBreakdownLineData(response);
                        setYearMonth(response)

                    }

                }

            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        const fetchCostBreakdownPieData = async () => {
            try {
                const response = await submitSets(submitCollection.cost_breakdown_pie);
                console.log("Pie : ", response);
                setCostBreakdownPieData(response);
            } catch (error) {
                console.error('Error fetching Cost Breakdown:', error);
            }
        };

        fetchCostBreakdownLineData();
        fetchCostBreakdownPieData();
    }, [fromDate, selectedLand]);

    costBreakdownLineData.forEach((item) => {
        item.totalCost = parseFloat(item.totalCost);
    });

    const uniqueMonths = [...new Set(costBreakdownLineData.map((item) => item.yearMonth))];

    let chartData
    let chartOptions

    if (!fromDate) {

        chartData = {
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

        chartOptions = {
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
                        text: 'Cost (Rs)',
                    },
                    ticks: {
                        // stepSize: 10,
                    },
                },
            },
        };

    } else {

        chartData = {
            labels: [...new Set(costBreakdownLineData.map(item => item.expenseType))],
            datasets: [
                {
                    label: 'Total Cost',
                    data: [...new Set(costBreakdownLineData.map(item => item.totalCost))],
                    backgroundColor: generateRandomColors(1)[0],
                    borderWidth: 1,
                },
            ],
        };

        chartOptions = {
            scales: {
                x: {
                    type: 'category',
                    title: {
                        display: true,
                        text: 'Expense Type',
                    },
                },
                y: {
                    type: 'linear',
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Cost',
                    },
                },
            },
        };
    }

    // pie chart

    const uniqueColors = generateRandomColors(costBreakdownPieData.length);

    const totalCosts = costBreakdownPieData.map((item) => parseFloat(item.totalCost));
    // const total = totalCosts.reduce((accumulator, item) => accumulator + parseFloat(item.totalCost), 0);

    let total = 0;

    for (let i = 0; i < costBreakdownPieData.length; i++) {
        let cost = parseFloat(costBreakdownPieData[i].totalCost);

        if (!isNaN(cost)) {
            total += cost;
        }
    }

    console.log(total);

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
                {fromDate ? (
                    <h2>Cost Breakdown {fromDate}</h2>
                ) : (
                    <h2>Cost Breakdown Line Chart</h2>
                )}
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='attendance-chart'>
                    {costBreakdownLineData.length > 0 ? (
                        fromDate ? (
                            <Bar data={chartData} options={chartOptions} />
                        ) : (
                            <Line data={chartData} options={chartOptions} />
                        )
                    ) : (
                        <p className='reportnotfound'>
                            Data Not Found !
                        </p>
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
                        <p className='reportnotfound'>
                            Data Not Found !
                        </p>
                    )}
                </div>
            </div>

            <br />
        </>
    );
};

export default CostBreakdownReport;
