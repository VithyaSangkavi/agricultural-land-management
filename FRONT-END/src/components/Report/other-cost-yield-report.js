import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './report.css'
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale, BarElement } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { useTranslation } from 'react-i18next';

ChartJS.register(LineElement, BarElement, PointElement, Tooltip, Legend, LinearScale, TimeScale, CategoryScale);

const CostYieldReport = ({ dateRange, landId, lotId, selectedLot }) => {
    const [t, i18n] = useTranslation();

    const [costYieldData, setCostYieldData] = useState({});

    const fromDate = dateRange && dateRange.fromDate;
    const toDate = dateRange && dateRange.toDate;

    console.log('passed land id: ', landId)

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                let response;

                if (fromDate && toDate && landId) {
                    // filter by fromDate, toDate and landId
                    console.log('inside from to land')
                    response = await axios.get(`http://localhost:8081/service/master/other-cost-yield?startDate=${fromDate}&endDate=${toDate}&landId=${landId}`);
                } else if (fromDate && toDate && lotId) {
                    // filter by fromDate, toDate and lotId
                    console.log('inside from to lot')
                    response = await axios.get(`http://localhost:8081/service/master/other-cost-yield?startDate=${fromDate}&endDate=${toDate}&lotId=${lotId}`);
                } else if (fromDate && toDate) {
                    // filter by fromDate, toDate
                    response = await axios.get(`http://localhost:8081/service/master/other-cost-yield?startDate=${fromDate}&endDate=${toDate}`);
                } else if (lotId) {
                    // filter by lotId 
                    response = await axios.get(`http://localhost:8081/service/master/other-cost-yield?lotId=${lotId}`);
                } else if (landId) {
                    // filter by landId 
                    response = await axios.get(`http://localhost:8081/service/master/other-cost-yield?landId=${landId}`);
                } else {
                    // without any filters
                    response = await axios.get('http://localhost:8081/service/master/other-cost-yield');
                }
                setCostYieldData(response.data);
            } catch (error) {
                console.error('Error fetching other cost yield report:', error);
            }
        };
        fetchData();
    }, [fromDate, toDate, landId, lotId]);

    //Grouped bar chart

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
            <div className='report-app-screen'>
                <div className='info-card'>
                    {fromDate && toDate && (
                        <p>{t('daterange')} :
                            {fromDate === '1970-01-01' && toDate === '2100-12-31' ? ' all' : `${fromDate} - ${toDate}`}
                        </p>
                    )}
                    {lotId && (
                        <p>{t('selectedlot')} : {selectedLot}</p>
                    )}
                </div>
                <h2 className='report-sub-heading'>{t('costyieldreport')}</h2>
                <table className='attendance-table'>
                    <thead>
                        <tr>
                            <th>{t('month')}</th>
                            <th>{t('cost')}</th>
                            <th>{t('yield')}</th>
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
                <h2 className='report-sub-heading'>{t('costvsyieldcomparisionchart')}</h2>
                <div className='attendance-chart'>
                    {Object.keys(costYieldData).length > 0 ? (
                        <Bar data={chartData} options={chartOptions} />
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

export default CostYieldReport;