import React, { useState, useEffect } from 'react';
import './summary.css';
import { Chart as ChartJS, LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { FaGlobeAmericas, FaLanguage, FaSearch, FaMapMarker } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';



ChartJS.register(LineElement, PointElement, Tooltip, Legend, LinearScale, TimeScale);


const SummaryReport = ({ selectedLand, category, fromDate, dateRange }) => {




    const [summaryData, setSummaryData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const { t, i18n } = useTranslation();
    // const [category, setSelectedCategory] = useState('');


    const [visibleRecords, setVisibleRecords] = useState(3);

    const handleSeeMore = () => {
        setVisibleRecords(prevVisibleRecords => prevVisibleRecords + 3);
    };

    const handleSeeLess = () => {
        setVisibleRecords(prevVisibleRecords =>
            prevVisibleRecords > 3 ? prevVisibleRecords - 3 : 3
        );
    };

    console.log("category : ", category)
    console.log("selectedLand : ", selectedLand)
    console.log("fromDate : ", fromDate)
    console.log("fromDate : ", dateRange)

    // function convertDateFormat(fromDate) {
    //     const dateParts = fromDate.split('-');
    //     const year = parseInt(dateParts[0]);
    //     const month = parseInt(dateParts[1]);

    //     // Create a Date object with the provided year and month
    //     const date = new Date(year, month - 1);

    //     // Format the date as "Month Year"
    //     const formattedDate = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(date);

    //     return formattedDate;
    // }

    // fromDate = convertDateFormat(fromDate)
    // console.log("fromDate convert: ", fromDate)




    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };



    console.log("category num in summary page: ", category)


    useEffect(() => {
        const fetchData = async () => {
            console.log("land and cat UE: ", selectedLand, category);

            if (category == 0) {
                try {

                    if (selectedLand) {
                        if (fromDate) {

                            const response = await submitSets(submitCollection.summary, '?landId=' + selectedLand + '&fromDate=' + fromDate, true);
                            console.log(response);
                            setSummaryData(response);

                        } else {

                            const response = await submitSets(submitCollection.summary, '?landId=' + selectedLand, true);
                            console.log(response);
                            setSummaryData(response);

                        }

                    } else {
                        const response = await submitSets(submitCollection.summary);
                        console.log(response);
                        setSummaryData(response);
                    }

                } catch (error) {
                    console.error("Error fetching summary data:", error);
                }
            } else if (category == 1) {
                try {

                    if (selectedLand) {

                        if (dateRange) {


                            console.log(dateRange)

                            const response = await submitSets(submitCollection.summary_weekly, '?landId=' + selectedLand + '&fromDate=' + dateRange.fromDate + '&toDate=' + dateRange.toDate, true);
                            console.log(response);
                            setSummaryData(response);

                        } else {

                            const response = await submitSets(submitCollection.summary_weekly, '?landId=' + selectedLand, true);
                            console.log(response);
                            setSummaryData(response);

                        }
                    } else {

                        const response = await submitSets(submitCollection.summary_weekly);
                        console.log(response);
                        setSummaryData(response);

                    }
                } catch (error) {
                    console.error("Error fetching weekly summary data:", error);
                }
            } else {
                try {

                    if (selectedLand) {

                        if (dateRange) {

                            const response = await submitSets(submitCollection.summary_daily, '?landId=' + selectedLand + '&fromDate=' + dateRange.fromDate + '&toDate=' + dateRange.toDate, true);
                            console.log(response);
                            setSummaryData(response);

                        } else {

                            const response = await submitSets(submitCollection.summary_daily, '?landId=' + selectedLand, true);
                            console.log(response);
                            setSummaryData(response);

                        }

                    } else {

                        const response = await submitSets(submitCollection.summary_daily);
                        console.log(response);
                        setSummaryData(response);

                    }
                } catch (error) {
                    console.error("Error fetching weekly summary data:", error);
                }
            }
        };

        fetchData();
    }, [selectedLand, category, fromDate, dateRange.fromDate, dateRange.toDate]);




    // const filteredData = summaryData.filter((item) => {
    //     if (category === 1) {
    //         return item.weekNumber.toLowerCase().includes(searchQuery.toLowerCase());
    //     } else if (category === 2) {
    //         return item.date.toLowerCase().includes(searchQuery.toLowerCase());
    //     } else {
    //         return item.month.toLowerCase().includes(searchQuery.toLowerCase());
    //     }
    // });

    // const handleCateChange = (event) => {
    //     setSelectedCategory(event.target.value);
    // }



    return (
        <>
            <div className='report-app-screen'>

                {category == 1 ? (

                    <h2>Weekly Summary Report</h2>

                ) : category == 2 ? (

                    <h2>Daily Summary Report</h2>

                ) : (

                    <h2>Monthly Summary Report</h2>

                )}


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
                            {summaryData.slice(0, visibleRecords).map((item, index) => (
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
                                Data Not Found !
                            </p>
                        </div>
                    </div>

                )}

                <div>

                    {summaryData.length > visibleRecords && (

                        <button className='see-more' onClick={handleSeeMore}>
                            See More
                        </button>


                    )}

                    {visibleRecords > 3 && (
                        <button className='see-more' onClick={handleSeeLess}>
                            See Less
                        </button>
                    )}

                </div>
            </div >


            <br />
        </>
    );
};

export default SummaryReport;