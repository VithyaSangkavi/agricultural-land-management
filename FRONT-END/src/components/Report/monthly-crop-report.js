import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import './report.css'
import { useTranslation } from 'react-i18next';

ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale);

const MonthlyCropReport = ({ dateRange, lotId, landId, selectedLot }) => {
    const [t, i18n] = useTranslation();

    const [monthlyCropData, setMonthlyCropData] = useState([]);

    const fromDate = dateRange && dateRange.fromDate;
    const toDate = dateRange && dateRange.toDate;

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;
                if (fromDate && toDate && lotId) {

                    // filter by fromDate, toDate, and landId 
                    response = await axios.get(`http://localhost:8081/service/master/monthly-crop-report?startDate=${fromDate}&endDate=${toDate}&lotId=${lotId}`);
                } else if (fromDate && toDate && landId) {
                    // filter by fromDate and toDate 
                    response = await axios.get(`http://localhost:8081/service/master/monthly-crop-report?startDate=${fromDate}&endDate=${toDate}&landId=${landId}`);

                } else if (fromDate && toDate) {
                    // filter by fromDate and toDate 
                    response = await axios.get(`http://localhost:8081/service/master/monthly-crop-report?startDate=${fromDate}&endDate=${toDate}`);
                } else if (lotId) {
                    // filter by lotId

                    response = await axios.get(`http://localhost:8081/service/master/monthly-crop-report?lotId=${lotId}`);
                } else if (landId) {
                    // filter by landId
                    response = await axios.get(`http://localhost:8081/service/master/monthly-crop-report?landId=${landId}`);

                } else {
                    // without any filters
                    response = await axios.get('http://localhost:8081/service/master/monthly-crop-report');
                }
                setMonthlyCropData(response.data);
            } catch (error) {
                console.error('Error fetching monthly crop report:', error);
            }
        };

        fetchData();
    }, [fromDate, toDate, lotId, landId]);

    //Lined chart

    const chartData = {
        labels: Object.keys(monthlyCropData),
        datasets: [
            {
                label: 'Past Year Quantity',
                data: Object.values(monthlyCropData).map(data => data[0].PastYearTotalQuantity),
                fill: false,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
            },
            {
                label: 'Current Year Quantity',
                data: Object.values(monthlyCropData).map(data => data[0].CurrentYearTotalQuantity),
                fill: false,
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 2,
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
                offset: true,
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
        elements: {
            point: {
                radius: 3,
            },
        },
    };

    return (
        <>
            <div className='report-app-screen'>
                <div className='info-card'>
                    {fromDate && toDate && (
                        <p>{t('daterange')} : {fromDate} - {toDate}</p>
                    )}
                    {lotId && (
                        <p>{t('selectedlot')} : {selectedLot}</p>
                    )}
                </div>
                <h2 className='report-sub-heading'>{t('monthlycropreport')}</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>{t('month')}</th>
                            <th>{t('pastyearquantity')}</th>
                            <th>{t('currentyearquantity')}</th>
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
                <h2 className='report-sub-heading'>{t('monthlycropcomparisionchart')}</h2>
                <div className='attendance-chart'>
                    {Object.keys(monthlyCropData).length > 0 ? (
                        <Line data={chartData} options={chartOptions} />
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

export default MonthlyCropReport;
