import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import '../home/home.css';
import './report.css'
import Footer from '../footer/footer';
import { FaGlobeAmericas } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';
import EmployeeAttendanceReport from './employee-attendance-report';
import MonthlyCropReport from './monthly-crop-report';
import CostYieldReport from './other-cost-yield-report';
import EmployeePerfomnce from './employee-perfomnce-report';
import CostBreakdownReport from './cost-breakdown-report';
import SummaryReport from './summary-report';
import { submitSets } from '../UiComponents/SubmitSets';
import { connect } from 'react-redux';
import { submitCollection } from '../../_services/submit.service';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { alertService } from '../../_services/alert.service';
import { Col, Form } from 'react-bootstrap';
import { MdArrowBackIos } from "react-icons/md";


function Report({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();

    const history = useHistory();

    const [lots, setLots] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedReport, setSelectedReport] = useState('');
    const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });
    const [selectedLot, setSelectedLot] = useState('');
    const [selectedWorker, setSelectedWorker] = useState('');
    const [isFilterExpanded, setFilterExpanded] = useState(false);
    const [lotId, setLotId] = useState('');
    const [landNames, setLandNames] = useState([]);


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

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        setSelectedLandId(newSelectedLandId);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);

        });
    }, [submitCollection.manageland]);


    useEffect(() => {
        //lot find all
        axios.get('http://localhost:8080/service/master/lotFindAll').then((response) => {
            setLots(response.data.extra);
            console.log("Lots : ", response.data.extra);
        });
    }, [])



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

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="home-app-screen">
            <div className='main-heading'>
                <div className="outer-frame d-flex justify-content-between">
                    <MdArrowBackIos className="back-button" onClick={goBack} />
                    <div className="land-filter">
                        <Dropdown className='custom-dropdown'>
                            <Col md={6}>
                                <Form.Group>
                                    <Form.Control as="select" value={selectedLandId} onChange={handleLandChange}>
                                        {landNames.map((land) => (
                                            <option key={land.id} value={land.id}>
                                                {land.name}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Dropdown>
                    </div>

                    <div className="language-filter me-2">
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
                </div>
            </div>

            <div className="filter-icon" onClick={handleToggleFilter}>
                <FaPlus />
            </div>

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
                                    type="date"
                                    name="fromDate"
                                    value={dateRange.fromDate}
                                    onChange={handleDateRangeChange}
                                />
                                <span> - </span>
                                <input
                                    type="date"
                                    name="toDate"
                                    value={dateRange.toDate}
                                    onChange={handleDateRangeChange}
                                />
                            </>
                        )}
                    </div>

                    {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && (

                        <div>
                            <label> {t('selectlot')} : </label>
                            <select value={selectedLot} onChange={handleLotChange}>
                                <option value="">{t('selectlot')}</option>
                                {lots.map((lot) => (
                                    <option key={lot.id} value={lot.name}>
                                        {lot.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && selectedReport != 'Employee Attendance' && selectedReport != 'Monthly Crop' && (
                        <div>
                            <label>{t('selectworker')} : </label>
                            <select value={selectedWorker} onChange={handleWorkerChange}>
                                <option value="">{t('selectworker')}</option>
                            </select>
                        </div>
                    )}
                    <br />

                    <button onClick={handleResetFilters}>{t('resetfilters')}</button>

                </div>
            )}



            <div className="drop-down-container">
                <p className="home-heading">{t('report')}</p>
            </div>

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



            {showEmployeeAttendanceReport && <EmployeeAttendanceReport dateRange={dateRange} lotId={lotId} landId={selectedLandId} />}
            {showMonthlyCropReport && <MonthlyCropReport dateRange={dateRange} lotId={lotId} />}
            {showCostYieldReport && <CostYieldReport dateRange={dateRange} landId={selectedLandId} />}
            {showEmployeePerfomnce && <EmployeePerfomnce dateRange={dateRange} selectedLand={selectedLandId} />}
            {showCostBreakdown && <CostBreakdownReport selectedLand={selectedLandId} dateRange={dateRange} />}
            {showSummary && <SummaryReport selectedLand={selectedLandId} category={category} />}
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

            < br />
            <Footer />
        </div>
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);