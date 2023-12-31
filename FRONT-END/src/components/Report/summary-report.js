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
        const fetchData = async () => {
            console.log("land and cat UE: ", selectedLand, category);

            if (category == 0) {
                try {
                    const response = await axios.get(`http://localhost:8080/service/master/summary?landId=${selectedLand}`);
                    console.log(response.data);
                    setSummaryData(response.data);
                } catch (error) {
                    console.error("Error fetching summary data:", error);
                }
            } else if (category == 1) {
                try {
                    const response = await axios.get(`http://localhost:8080/service/master/summary-weekly?landId=${selectedLand}`);
                    console.log(response.data);
                    setSummaryData(response.data);
                } catch (error) {
                    console.error("Error fetching weekly summary data:", error);
                }
            } else {
                try {
                    const response = await axios.get(`http://localhost:8080/service/master/summary-daily?landId=${selectedLand}`);
                    console.log(response.data);
                    setSummaryData(response.data);
                } catch (error) {
                    console.error("Error fetching weekly summary data:", error);
                }
            }
        };

        fetchData();
    }, [selectedLand, category]);


    return (
        <>
            <div className='report-app-screen'>
                <h2>Employee Summary Report</h2>

                {summaryData.length > 0 ? (
                    <table className='attendance-table'>
                        <thead>
                            <tr>

                                {category == 1 ? (
                                    <>
                                        <th>Year</th>
                                        <th>Week</th>
                                        <th>Kg</th>
                                        <th>Plucking Expenses</th>
                                        <th>Other Expenses</th>
                                        <th>Non-crew Expenses</th>
                                        <th>Income</th>
                                        <th>Profit</th>
                                        <th>CIR</th>
                                    </>
                                ) : category == 2 ? (
                                    <>
                                        <th>Date</th>
                                        <th>Kg</th>
                                        <th>Plucking Expenses</th>
                                        <th>Other Expenses</th>
                                        <th>Non-crew Expenses</th>
                                        <th>Profit</th>
                                        <th>CIR</th>
                                    </>
                                ) : (
                                    <>
                                        <th>Year</th>
                                        <th>Month</th>
                                        <th>Kg</th>
                                        <th>Plucking Expenses</th>
                                        <th>Other Expenses</th>
                                        <th>Non-crew Expenses</th>
                                        <th>Income</th>
                                        <th>Profit</th>
                                        <th>CIR</th>
                                    </>
                                )}
                            </tr>

                        </thead>
                        <tbody>
                            {summaryData.map((item, index) => (
                                <tr key={index}>


                                    {category == 1 ? (
                                        <>
                                            <td>{item.year}</td>
                                            <td>{item.weekNumber}</td>
                                            <td>{item.totalQuantity}</td>
                                            <td>{item.PluckExpense}</td>
                                            <td>{item.OtherExpenses}</td>
                                            <td>{item.NonCrewExpenses}</td>
                                            <td>{item.TotalIncome}</td>
                                            <td>{item.Profit}</td>
                                            <td>{item.CIR}</td>
                                        </>
                                    ) : category == 2 ? (
                                        <>
                                            <td>{item.date}</td>
                                            <td>{item.totalQuantity}</td>
                                            <td>{item.PluckExpense}</td>
                                            <td>{item.OtherExpenses}</td>
                                            <td>{item.NonCrewExpenses}</td>
                                            <td>{item.Profit}</td>
                                            <td>{item.CIR}</td>
                                        </>

                                    ) : (
                                        <>
                                            <td>{item.year}</td>
                                            <td>{item.month}</td>
                                            <td>{item.totalQuantity}</td>
                                            <td>{item.PluckExpense}</td>
                                            <td>{item.OtherExpenses}</td>
                                            <td>{item.NonCrewExpenses}</td>
                                            <td>{item.TotalIncome}</td>
                                            <td>{item.Profit}</td>
                                            <td>{item.CIR}</td>
                                        </>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table >

                ) : (
                    <div>
                        <br />
                        <div className='attendance-chart'>
                            <p className='reportnotfound'>
                                Please Select Land !
                            </p>
                        </div>
                    </div>

                )}
            </div >
            <br />
        </>
    );
};

export default SummaryReport;