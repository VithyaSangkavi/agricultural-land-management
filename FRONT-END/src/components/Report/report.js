import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import '../home/home.css';
import './report.css'
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus, FaFilter } from 'react-icons/fa';
import EmployeeAttendanceReport from './employee-attendance-report';
import MonthlyCropReport from './monthly-crop-report';
import CostYieldReport from './other-cost-yield-report';
import EmployeePerfomnce from './employee-perfomnce-report';
import CostBreakdownReport from './cost-breakdown-report';
import SummaryReport from './summary-report';

function Report() {
    const [t, i18n] = useTranslation();

    const history = useHistory();

    const [lands, setLands] = useState([]);
    const [lots, setLots] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedReport, setSelectedReport] = useState('');
    const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });
    const [selectedLot, setSelectedLot] = useState('');
    const [selectedWorker, setSelectedWorker] = useState('');
    const [isFilterExpanded, setFilterExpanded] = useState(false);
    const [lotId, setLotId] = useState('');
    const [landId, setLandId] = useState('');

    const [showEmployeeAttendanceReport, setShowEmployeeAttendanceReport] = useState(false);
    const [showMonthlyCropReport, setShowMonthlyCropReport] = useState(false);
    const [showCostYieldReport, setShowCostYieldReport] = useState(false);

    const [showEmployeePerfomnce, setEmployeePerfomnce] = useState(false);
    const [showCostBreakdown, setCostBreakdown] = useState(false);
    const [showSummary, setSummary] = useState(false);
    const [category, setSelectedCategory] = useState('');
    const extraValue = 'All Lands';


    const handleCateChange = (event) => {
        setSelectedCategory(event.target.value);
    }

    console.log("report cat : ", category)


    const handleReportChange = (event) => {
        setSelectedReport(event.target.value);

        if (event.target.value === 'Employee Attendance') {
            setShowEmployeeAttendanceReport(true);
        } else {
            setShowEmployeeAttendanceReport(false);
        }

        if (event.target.value === 'Monthly Crop') {
            setShowMonthlyCropReport(true);
        } else {
            setShowMonthlyCropReport(false);
        }

        if (event.target.value === 'Other Cost / Yield') {
            setShowCostYieldReport(true);
        } else {
            setShowCostYieldReport(false);
        }

        if (event.target.value === 'Employee Perfomance') {
            setEmployeePerfomnce(true);
        } else {
            setEmployeePerfomnce(false);
        }

        if (event.target.value === 'Cost Breakdown') {
            setCostBreakdown(true);
        } else {
            setCostBreakdown(false);
        }

        if (event.target.value === 'Summary') {
            setSummary(true);
        } else {
            setSummary(false);
        }
    };

    useEffect(() => {
        //land find all
        axios.get('http://localhost:8081/service/master/landFindAll').then((response) => {
            setLands(response.data.extra);
            console.log("Lands : ", response.data.extra);
        });

        //lot find all
        axios.get('http://localhost:8081/service/master/lotFindAll').then((response) => {
            setLots(response.data.extra);
            console.log("Lots : ", response.data.extra);
        });
    }, [])

    const handleSelectedLand = (eventkey) => {
        setSelectedLand(eventkey);

        axios.post(`http://localhost:8081/service/master/findLandIdByName?name=${eventkey}`)
            .then((response) => {
                const landIdTask = response.data.extra;
                const taskLand = JSON.stringify(landIdTask);
                const landData = JSON.parse(taskLand);
                const landId = landData.landId;
                setLandId(landId);
                console.log('Selected Land Id :', landId);
                localStorage.setItem('SelectedLandId', landId);

            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    // const handleReportChange = (event) => {
    //     setSelectedReport(event.target.value);
    // };

    const handleResetFilters = () => {
        setDateRange({ fromDate: '', toDate: '' });
        setSelectedLot('');
        setSelectedWorker('');
    };

    const handleDateRangeChange = (event) => {
        const { name, value } = event.target;
        setDateRange((prevDateRange) => ({ ...prevDateRange, [name]: value }));
    };

    const handleLotChange = (event) => {
        const selectedLotName = event.target.value;
        setSelectedLot(selectedLotName);
        console.log('selected lot: ', selectedLotName);

        const selectedLot = lots.find((lot) => lot.name === selectedLotName);

        if (selectedLot) {
            const selectedLotId = selectedLot.id;
            setLotId(selectedLotId);
            console.log('Selected Lot ID:', selectedLotId);
        } else {
            setLotId('');
            console.log('Lot not found');
        }

    };

    const handleWorkerChange = (event) => {
        setSelectedWorker(event.target.value);
    };

    const handleToggleFilter = () => {
        setFilterExpanded(!isFilterExpanded);
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    console.log(dateRange);

    return (
        <div className="home-app-screen">
            <p className='main-heading'>{t('report')}</p>
            <div className="position-absolute top-0 end-0 me-2">
                <Dropdown alignRight onSelect={handleLanguageChange}>
                    <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                        <FaGlobeAmericas style={{ color: 'white' }} />
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item eventKey="en">English</Dropdown.Item>
                        <Dropdown.Item eventKey="sl">Sinhala</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className='drop-down-container'>
                <Dropdown onSelect={handleSelectedLand} className='custom-dropdown'>
                    <Dropdown.Toggle className='drop-down' id="dropdown-land">
                        {selectedLand || t('selectland')}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className='drop-down-menu'>
                        {lands.map((land) => (
                            <div key={land.id}>
                                <Dropdown.Item eventKey={land.name}>{land.name}</Dropdown.Item>
                            </div>
                        ))}
                        <div key={extraValue}>
                            <Dropdown.Item eventKey={extraValue}>{extraValue}</Dropdown.Item>
                        </div>
                    </Dropdown.Menu>
                </Dropdown>
            </div>

            <div className='report-dropdown-container'>
                <select className='report-dropdown'
                    value={selectedReport}
                    onChange={handleReportChange}
                >
                    <option value="">{t('reportname')}</option>
                    <option value="Summary">{t('summary')}</option>
                    <option value="Employee Perfomance">{t('employeeperformance')}</option>
                    <option value="Cost Breakdown">{t('costbreakdown')}</option>
                    <option value="Employee Attendance">{t('employeeattendance')}</option>
                    <option value="Monthly Crop">{t('monthlycrop')}</option>
                    <option value="Other Cost / Yield">{t('othercostyield')}</option>
                </select>

                <div className="filter-icon" onClick={handleToggleFilter}>
                    <FaFilter />
                </div>
            </div>

            <div className='filtering-card'>
                {isFilterExpanded && (
                    <div>
                        <div>
                            {showCostBreakdown ? (
                                <>
                                    <label>Month : </label>
                                    <input
                                        type="month"
                                        name="fromDate"
                                        value={dateRange.fromDate}
                                        onChange={handleDateRangeChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <label>{t('daterange')} : </label>
                                    <input
                                        className='custom-select'
                                        type="date"
                                        name="fromDate"
                                        value={dateRange.fromDate}
                                        onChange={handleDateRangeChange}
                                    />
                                    <span> - </span>
                                    <input
                                        className='custom-select'
                                        type="date"
                                        name="toDate"
                                        value={dateRange.toDate}
                                        onChange={handleDateRangeChange}
                                    />
                                </>
                            )}
                        </div>
                        <br />
                        {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && (

                            <div>
                                <label> {t('selectlot')} : </label>
                                <select className="custom-select" value={selectedLot} onChange={handleLotChange}>
                                    <option value="">{t('selectlot')}</option>
                                    {lots.map((lot) => (
                                        <option key={lot.id} value={lot.name}>
                                            {lot.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <br />
                        {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && selectedReport != 'Employee Attendance' && selectedReport != 'Monthly Crop' && (
                            <div>
                                <label>{t('selectworker')} : </label>
                                <select className="custom-select" value={selectedWorker} onChange={handleWorkerChange}>
                                    <option value="">{t('selectworker')}</option>
                                </select>
                            </div>
                        )}

                        <button onClick={handleResetFilters} className='reset-filter'> {t('resetfilters')} </button>

                    </div>
                )}
            </div>

            {selectedReport === 'Summary' ? (
                <>
                    <select className='report-dropdown'
                        // value={selectedReportCate}
                        onChange={handleCateChange}
                    >
                        <option value="">Monthly</option>
                        <option value="1">Weekly</option>
                        <option value="2">Daily</option>
                    </select>
                </>
            ) : null}



            {selectedReport === 'Summary' ? (
                <>
                    <select className='report-dropdown'
                        // value={selectedReportCate}
                        onChange={handleCateChange}
                    >
                        <option value="">Monthly</option>
                        <option value="1">Weekly</option>
                        <option value="2">Daily</option>
                    </select>
                </>
            ) : null}



            {showEmployeeAttendanceReport && <EmployeeAttendanceReport dateRange={dateRange} lotId={lotId} landId={landId} selectedLot={selectedLot} />}
            {showMonthlyCropReport && <MonthlyCropReport dateRange={dateRange} lotId={lotId} landId={landId} selectedLot={selectedLot} />}
            {showCostYieldReport && <CostYieldReport dateRange={dateRange} landId={landId} lotId={lotId} selectedLot={selectedLot} />}
            {showEmployeePerfomnce && <EmployeePerfomnce dateRange={dateRange} selectedLand={selectedLand} />}
            {showCostBreakdown && <CostBreakdownReport selectedLand={selectedLand} dateRange={dateRange} />}
            {showSummary && <SummaryReport selectedLand={selectedLand} category={category} />}
            < br />
            <Footer />
        </div>
    );
}

export default Report;