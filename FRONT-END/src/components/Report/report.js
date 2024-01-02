import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import '../home/home.css';
import './report.css'
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaMapMarker } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaFilter, FaUndo, FaCalendarAlt } from 'react-icons/fa';
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
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

function Report({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();

    const history = useHistory();

    const [lots, setLots] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');
    const [selectedReport, setSelectedReport] = useState('');
    // const [dateRange, setDateRange] = useState({ fromDate: '', toDate: '' });
    const [selectedLot, setSelectedLot] = useState('');
    const [selectedWorker, setSelectedWorker] = useState('');
    const [isFilterExpanded, setFilterExpanded] = useState(false);
    const [lotId, setLotId] = useState('');
    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);


    const [showEmployeeAttendanceReport, setShowEmployeeAttendanceReport] = useState(false);
    const [showMonthlyCropReport, setShowMonthlyCropReport] = useState(false);
    const [showCostYieldReport, setShowCostYieldReport] = useState(false);

    const [showEmployeePerfomnce, setEmployeePerfomnce] = useState(false);
    const [showCostBreakdown, setCostBreakdown] = useState(false);
    const [showSummary, setSummary] = useState(false);
    const [category, setSelectedCategory] = useState('');

    const extraValue = 'All Lands';

    const [dateRange, setDateRange] = useState([
        {
            startDate: new Date('1970-01-01'),
            endDate: new Date('2100-12-31'),
            key: 'selection',
        },
    ]);

    const [showPicker, setShowPicker] = useState(false);

    const handleLabelClick = () => {
        setShowPicker(!showPicker);
    };

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
        console.log("Land : ", event);
        setSelectedLandId(event);
    };

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });

        if (selectedLandId) {
            submitSets(submitCollection.getlandbyid, "?landId=" + selectedLandId, true)
                .then((res) => {
                    setLandName(res.extra ? res.extra.name : "All Lands");
                })
                .catch((error) => {
                    console.error("Error fetching land by id:", error);
                });
        } else {
            setLandName("All Lands");
        }
    }, [submitCollection.manageland, selectedLandId]);



    useEffect(() => {
        //lot find all
        axios.get('http://localhost:8080/service/master/lotFindAll').then((response) => {
            setLots(response.data.extra);
            console.log("Lots : ", response.data.extra);
        });
    }, [])

    const handleResetFilters = () => {
        setDateRange([{ startDate: new Date('1970-01-01'), endDate: new Date('2100-12-31'), key: 'selection' }]);
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

    const handleSelect = (ranges) => {
        setDateRange([ranges.selection]);
        console.log('from date: ', ranges.selection.startDate);
        console.log('to date: ', ranges.selection.endDate);
    };

    function changeDateFormat(inputDate) {
        const date = new Date(inputDate);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }

    const formatDate = (value) => {
        console.log('tast date: ', value[0].startDate);
        const formattedStartDate = changeDateFormat(value[0].startDate);
        const formattedEndDate = changeDateFormat(value[0].endDate);

        console.log('start date: ', formattedStartDate);
        console.log('end date: ', formattedEndDate);

        const dateRange = {
            fromDate: formattedStartDate,
            toDate: formattedEndDate
        }

        console.log('start date: ', dateRange.fromDate);
        console.log('end date: ', dateRange.toDate);

        return dateRange;

    }

    return (
        <div className="home-app-screen">
            <div className='main-heading'>

                <div className="outer-frame d-flex justify-content-between align-items-center">
                    <div className="filter-container d-flex align-items-center">
                        <MdArrowBackIos className="back-button" onClick={goBack} />
                    </div>

                    <div className="filter-container d-flex align-items-center">
                        <div className="land-filter">
                            <Dropdown onSelect={handleLandChange}>
                                <Dropdown.Toggle variant="secondary" style={{ background: 'none', border: 'none' }}>
                                    <FaMapMarker style={{ color: 'white' }} />
                                </Dropdown.Toggle>

                                <Dropdown.Menu>
                                    <Dropdown.Item eventKey="">All Lands</Dropdown.Item>
                                    {landNames.map((land) => (
                                        <Dropdown.Item eventKey={land.id} value={land.id}>
                                            {land.name}
                                        </Dropdown.Item>
                                    ))}
                                </Dropdown.Menu>
                            </Dropdown>
                        </div>

                        <div className="language-filter">
                            <Dropdown onSelect={handleLanguageChange}>
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
            </div>

            <div className="drop-down-container" style={{ marginTop: "0px" }}>

                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>
                <p className="home-heading">{t('report')}</p>
            </div>

            <select className='report-dropdown'
                value={selectedReport}
                onChange={handleReportChange}
            >
                <option value="Empty">{t('reportname')}</option>
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

            <div className='filtering-card'>
                {isFilterExpanded && (
                    <div>
                        <div>
                            {showCostBreakdown ? (
                                <>
                                    <label className='custom-label'>Month : </label>
                                    <input
                                        className='custom-select'
                                        type="month"
                                        name="fromDate"
                                        value={dateRange.fromDate}
                                        onChange={handleDateRangeChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <label className='custom-label'>
                                        {t('daterange')} :
                                    </label>
                                    <FaCalendarAlt className='calendar-icon' onClick={handleLabelClick} />


                                    <div className='date-range-picker'>
                                        {showPicker && (
                                            <DateRange
                                                ranges={dateRange}
                                                onChange={handleSelect}
                                                editableDateInputs={true}
                                                dragSelectionEnabled={true}
                                                rangeColors={['#0079224D']}

                                            />
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                        {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && selectedReport != 'Cost Breakdown' && (

                            <div>
                                <label className='custom-label'> {t('selectlot')} : </label>
                                <select className='custom-select' value={selectedLot} onChange={handleLotChange}>
                                    <option value="">{t('selectlot')}</option>
                                    {lots.map((lot) => (
                                        <option key={lot.id} value={lot.name}>
                                            {lot.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {selectedReport !== 'Employee Perfomance' && selectedReport !== 'Summary' && selectedReport != 'Employee Attendance' && selectedReport != 'Monthly Crop' && selectedReport != 'Other Cost / Yield' && selectedReport != 'Cost Breakdown' && (
                            <div>
                                <label className='custom-label'>{t('selectworker')} : </label>
                                <select className='custom-select' value={selectedWorker} onChange={handleWorkerChange}>
                                    <option value="">{t('selectworker')}</option>
                                </select>
                            </div>
                        )}

                        {selectedReport === 'Summary' ? (
                            <div>
                                <select className='custom-select'
                                    // value={selectedReportCate}
                                    onChange={handleCateChange}
                                >
                                    <option value="0">Monthly</option>
                                    <option value="1">Weekly</option>
                                    <option value="2">Daily</option>
                                </select>
                            </div>
                        ) : null}
                        <div className='reset-filter'>
                            <button className='reset-filter-button' onClick={handleResetFilters}>{t('resetfilters')}</button>
                        </div>
                    </div>
                )}

            </div>

            {showEmployeeAttendanceReport && <EmployeeAttendanceReport dateRange={formatDate(dateRange)} lotId={lotId} landId={selectedLandId} selectedLot={selectedLot} />}
            {showMonthlyCropReport && <MonthlyCropReport dateRange={formatDate(dateRange)} lotId={lotId} selectedLot={selectedLot} />}
            {showCostYieldReport && <CostYieldReport dateRange={formatDate(dateRange)} landId={selectedLandId} lotId={lotId} selectedLot={selectedLot} />}
            {showEmployeePerfomnce && <EmployeePerfomnce dateRange={formatDate(dateRange)} selectedLand={selectedLandId} />}
            {showCostBreakdown && <CostBreakdownReport selectedLand={selectedLandId} dateRange={formatDate(dateRange)} />}
            {showSummary && <SummaryReport selectedLand={selectedLandId} category={category} />}
            < br /> <br/> <br/>
            <Footer />
        </div >
    );
}

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(Report);