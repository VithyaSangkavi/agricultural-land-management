import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './report.css';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { useLocation } from 'react-router-dom';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale);


const EmployeeAttendanceReport = ({dateRange, lotId}) => {
    const [attendanceData, setAttendanceData] = useState([]);

    const fromDate = dateRange && dateRange.fromDate;
    const toDate = dateRange && dateRange.toDate;

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (fromDate && toDate && lotId) {
                    // filter by fromDate, toDate, and lotId 
                    response = await axios.get(`http://localhost:8081/service/master/employee-attendance?startDate=${fromDate}&endDate=${toDate}&lotId=${lotId}`);
                } else if (fromDate && toDate) {
                    // filter by fromDate and toDate 
                    response = await axios.get(`http://localhost:8081/service/master/employee-attendance?startDate=${fromDate}&endDate=${toDate}`);
                } else if (lotId) {
                    // filter by lotId
                    response = await axios.get(`http://localhost:8081/service/master/employee-attendance?lotId=${lotId}`);
                } else {
                    // without any filters
                    response = await axios.get('http://localhost:8081/service/master/employee-attendance');
                }
                setAttendanceData(response.data);
            } catch (error) {
                console.error('Error fetching employee attendance:', error);
            }
        };

        fetchData();
    }, [fromDate, toDate, lotId]);

    //Lined chart
    
    const chartData = {

        labels: attendanceData.map((item) => item.date),
        datasets: [
            {
                label: 'Number of Workers',
                data: attendanceData.map((item) => item.numberOfWorkers),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 2,
                lineTension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    tooltipFormat: 'yyyy-MM-dd', 
                    displayFormats: {
                        day: 'yyyy-MM-dd' 
                    },
                },
                title: {
                    display: true,
                    text: 'Day',
                },
                offset: true,
            },
            y: {
                type: 'linear',
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Workers',
                },
                ticks: {
                    stepSize: 1,
                },
            },
        },
        elements: {
            point: {
                radius: 3,
            },
        },
    };

    return (
        <>
            <div className='report-app-screen'>
                <h2>Employee Attendance Report</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>Day</th>
                            <th>No. of Workers</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceData.map((item, index) => (
                            <tr key={index}>
                                <td>{item.date}</td>
                                <td>{item.numberOfWorkers}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <br />
            <div className='report-app-screen'>
                <div className='attendance-chart'>
                    <h2>Employee Attendance Chart</h2>
                    {attendanceData.length > 0 ? (
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

export default EmployeeAttendanceReport;