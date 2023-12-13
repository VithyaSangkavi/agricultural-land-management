import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './summary.css';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale);


const SummaryReport = ({ selectedLand, category }) => {
    const [summaryData, setSummaryData] = useState([]);

    console.log("category num in summary page: ", category)


    useEffect(() => {
        // Fetch summaryData when landId changes
        const fetchSummaryData = async () => {
            try {

                const baseURL = 'http://localhost:8080/service/master/summary'

                if (category) {

                    const fetchURL = `${baseURL}?landId=${selectedLand}&cateNum=${category}`
                    const response = await axios.get(fetchURL)
                    setSummaryData(response.data);
                    console.log("Category Exists");

                } else {

                    const response = await axios.get(`http://localhost:8080/service/master/summary?landId=${selectedLand}`);
                    console.log(response.data);
                    setSummaryData(response.data);
                }


            } catch (error) {
                console.error('Error fetching employee summary:', error);
            }
        };

        fetchSummaryData();
    }, [selectedLand, category]);

    return (
        <>
            <div className='report-app-screen'>
                <h2>Employee Summary Report</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>Year</th>
                            <th>Month</th>
                            <th>Kg</th>
                            <th>Plucking Expenses</th>
                            <th>Other Expenses</th>
                            <th>Non-crew Expenses</th>
                            <th>Income</th>
                            <th>Profit</th>
                            <th>CIR</th>
                        </tr>
                    </thead>
                    <tbody>
                        {summaryData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.year}</td>
                                <td>{item.month}</td>
                                <td>{item.totalQuantity}</td>
                                <td>{item.PluckExpense}</td>
                                <td>{item.OtherExpenses}</td>
                                <td>{item.NonCrewExpenses}</td>
                                <td>{item.TotalIncome}</td>
                                <td>{item.Profit}</td>
                                <td>{item.CIR}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            {/* <div className='report-app-screen'>
                <div className='attendance-chart'>
                    <h2>Employee Summarye Chart</h2>
                    {summaryData.length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
                    ) : (
                        <p>Loading...</p>
                    )}
                </div>
            </div> */}
            <br />
        </>
    );
};

export default SummaryReport;