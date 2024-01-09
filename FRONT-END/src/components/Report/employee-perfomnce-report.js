import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './report.css';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale);


const EmployeePerfomnceReport = ({ dateRange: { fromDate, toDate }, selectedLand }) => {

    // const fromDate = dateRange.fromDate
    // const toDate = dateRange.toDate

    const [perfomnceData, setPerfomnceData] = useState([]);
    console.log("emp-per-rep : ", fromDate, toDate);
    const [visibleRecords, setVisibleRecords] = useState(3);

    const handleSeeMore = () => {
        setVisibleRecords(prevVisibleRecords => prevVisibleRecords + 3);
    };

    const handleSeeLess = () => {
        setVisibleRecords(prevVisibleRecords =>
            prevVisibleRecords > 3 ? prevVisibleRecords - 3 : 3
        );
    };


    useEffect(() => {

        const fetchPerfomnceData = async () => {
            try {

                if (selectedLand) {
                    if (fromDate && toDate) {
                        const response = await submitSets(submitCollection.employee_perfomance, '?landId=' + selectedLand + '&fromDate=' + fromDate + '&toDate=' +toDate);
                        setPerfomnceData(response);

                    } else {
                        const response = await submitSets(submitCollection.employee_perfomance, '?landId=' + selectedLand);
                        setPerfomnceData(response);

                    }

                } else {

                    if(fromDate && toDate) {

                        const response = await submitSets(submitCollection.employee_perfomance, '?fromDate=' + fromDate + '&toDate=' +toDate);
                        setPerfomnceData(response);


                    }else{

                        const response = await submitSets(submitCollection.employee_perfomance);
                        setPerfomnceData(response);


                    }
                }

            } catch (error) {
                console.error('Error fetching employee perfomnce:', error);
            }
        };

        fetchPerfomnceData();
    }, [fromDate, toDate, selectedLand]);

    const chartData = {
        labels: perfomnceData.map((item) => item.workDate),
        datasets: [...new Set(perfomnceData.map((item) => item.workerName))].map((workerName, index) => ({
            label: workerName,
            data: perfomnceData
                .filter((item) => item.workerName === workerName)
                .map((item) => ({ x: item.workDate, y: item.quantity })),
            fill: false,
            borderColor: `rgba(${index * 100}, 0, 0, 1)`,
            borderWidth: 2,
            lineTension: 0.1,
        })),
    };

    const chartOptions = {
        maintainAspectRatio: false,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'yyyy-MM-dd',
                    displayFormats: {
                        day: 'yyyy-MM-dd',
                    },
                },
                title: {
                    display: true,
                    text: 'Day',
                },
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Quantity (Kg)',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <>
            <div className='report-app-screen'>
                <div className='info-card'>
                    {fromDate && toDate && (
                        <p>
                            Date Range :
                            {fromDate === '1970-01-01' && toDate === '2100-12-31' ? ' all' : `${fromDate} - ${toDate}`}
                        </p>
                    )}
                </div>
                <h2>Employee Perfomnce Report</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>Quantity</th>
                            <th>Worker</th>
                        </tr>
                    </thead>
                    <tbody>
                        {perfomnceData.slice(0, visibleRecords).map((item, index) => (
                            <tr key={index}>
                                <td>{item.workDate}</td>
                                <td>{item.quantity}</td>
                                <td>{item.workerName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {perfomnceData.length > visibleRecords ? (
                    <div>
                        <button className='see-more' onClick={handleSeeMore}>
                            See More
                        </button>
                        {visibleRecords > 3 && (
                            <button className='see-more' onClick={handleSeeLess}>
                                See Less
                            </button>
                        )}
                    </div>
                ) : (
                    <button className='see-more' onClick={handleSeeLess}>
                        See Less
                    </button>
                )}

            </div>

            <div className='report-app-screen' style={{height: '360px', backgroundColor: ''}}>
                <div className='attendance-chart' style={{height: "300px", boxShadow: 'none'}}>
                    {perfomnceData.length > 0 ? (
                        <>
                            <h2>Employee Perfomnce Chart</h2> <br />

                            <Line data={chartData} options={chartOptions} />
                        </>
                    ) : (
                        <p className='reportnotfound'>
                            Data Not Found !
                        </p>
                    )}
                </div>
            </div >
        </>
    );
};

export default EmployeePerfomnceReport;