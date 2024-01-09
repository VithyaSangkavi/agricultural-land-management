import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import './manage-task.css';
import '../css/common.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faReopen } from '@fortawesome/free-solid-svg-icons';
import { Trash } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { alertService } from '../../_services/alert.service';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const CompletedTask = ({ selectedLandId }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [t, i18n] = useTranslation();
    const { taskAssignedid } = useParams();

    const history = useHistory();

    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});
    const [ongoingTaskName, setOngoingTaskName] = useState('');
    const [ongoingTaskDate, setOngoingTaskDate] = useState('');
    const [commanTaskDetails, setCommanTaskDetails] = useState([]);
    const [taskDetails, setTaskDetails] = useState([]);
    const [taskStatus, setTaskStatus] = useState('');
    const [taskExpenses, setTaskExpenses] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [quantityForPluck, setQuantityForPluck] = useState({});

    const sortedTaskDetails = taskDetails && taskDetails.length > 1
        ? taskDetails.sort((a, b) => new Date(b.date) - new Date(a.date))
        : taskDetails;

    useEffect(() => {
        console.log('task ass id: ', taskAssignedid);
        axios.get(`http://localhost:8081/service/master/findByTaskAssignedId?taskAssignedId=${taskAssignedid}`)
            .then((response) => {
                console.log('task expenses ------------ ', response.data.extra)
                setTaskExpenses(response.data.extra);
            })
            .catch((error) => {
                console.error('Error fetching task expenses:', error);
            });
    })

    useEffect(() => {
        const calculateTotalAmount = () => {
            const total = taskExpenses.reduce((acc, expense) => acc + expense.value, 0);
            setTotalAmount(total);

            console.log('Total amount: ', total);
        };

        calculateTotalAmount();
    }, [taskExpenses]);

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const options = {
            year: 'numeric',
            month: 'long',
            weekday: 'long',
        };
        const formattedDate = date.toLocaleDateString('en-US', options);
        const daySuffix = getDaySuffix(day);

        return `${day}${daySuffix} ${formattedDate}`;
    };

    const getDaySuffix = (day) => {
        if (day >= 11 && day <= 13) {
            return 'th';
        }
        const lastDigit = day % 10;
        switch (lastDigit) {
            case 1:
                return 'st';
            case 2:
                return 'nd';
            case 3:
                return 'rd';
            default:
                return 'th';
        }
    };

    console.log("ongoing task : ", taskAssignedid)

    useEffect(() => {
        console.log('USE EFFECT TASK ID: ', taskId);
        AddedWorkerList();
    }, [selectedLandId]);

    const AddedWorkerList = () => {

        axios.get(`http://localhost:8081/service/master/work-assigned-details/${taskAssignedid}`)
            .then((response) => {

                setTaskDetails(response.data.extra.cardDetails);
                setCommanTaskDetails(response.data.extra);
                setOngoingTaskName(response.data.extra.taskName);
                setTaskStatus(response.data.extra.taskStatus);
            })
            .catch((error) => {
                console.error('Error fetching task details:', error);
            });
    };

    const handleSelectedWorkerChange = (taskCardId, value) => {
        setSelectedWorker((prevSelectedWorkers) => ({
            ...prevSelectedWorkers,
            [taskCardId]: value,
        }));
    };

    const handleQuantityChange = (taskCardId, newQuantity) => {
        setQuantityForPluck((prevQuantities) => ({
            ...prevQuantities,
            [taskCardId]: newQuantity,
        }));
    };

    const formattedEndDate = getFormattedDate(commanTaskDetails.endDate);

    return (
        <div className="manage-task-app-screen">
            <Header />

            <div className='task-heading'>
                {commanTaskDetails.taskStatus === 'completed' ? (
                    <h6> {ongoingTaskName} {t('Task')} - {commanTaskDetails.taskStatus}
                        <br /><br />
                        {t('From')} - {ongoingTaskDate}
                        <br /><br />
                        {t('To')} - {formattedEndDate}
                    </h6>
                ) : (
                    <h6> {ongoingTaskName} {t('Task')} - {commanTaskDetails.taskStatus}
                        <br /><br />
                        {t('From')} - {ongoingTaskDate}
                    </h6>
                )}
            </div>
            <br />

            <div className="toggle-container">
                <button
                    onClick={() => setSelectedView('tasks')}
                    className={selectedView === 'tasks' ? 'active toggle-button' : 'toggle-button'}
                >
                    {t('tasks')}
                </button>
                <button
                    onClick={() => setSelectedView('finance')}
                    className={selectedView === 'finance' ? 'active toggle-button' : 'toggle-button'}
                >
                    {t('finance')}
                </button>
            </div>

            {/* Task Toggled View */}
            <>
                {taskDetails === undefined ? (
                    (() => {
                        alertService.info('No Data Found !');
                        history.push('/home')
                    })()
                ) : (
                    <>
                        {selectedView === 'tasks' && (
                            <div>
                                <div className='card-container'>

                                    {taskDetails.map((taskDetail) => (
                                        <div key={taskDetail.taskCardId} className='card'>
                                            <p>{t('date')} - <h6>{taskDetail.workDate ? getFormattedDate(taskDetail.workDate) : getFormattedDate(taskDetail.date)}</h6></p>
                                            <h6> Current Staus - {taskDetail.cardStatus}</h6>
                                            <p>---------------------------------------------</p>

                                            {taskDetail.workerDetails
                                                .map((workerDetail) => (
                                                    <div key={workerDetail.id} className="line">
                                                        <div className="worker-name-container">
                                                            {ongoingTaskName === 'Pluck' ? (
                                                                <div>
                                                                    <p>
                                                                        {workerDetail.workerName} - {workerDetail.quantity}
                                                                        {workerDetail.units}
                                                                    </p>
                                                                </div>
                                                            ) : (
                                                                <p>{workerDetail.workerName}</p>
                                                            )}
                                                        </div>


                                                        {taskStatus === 'ongoing' ? (
                                                            <>

                                                                {taskDetail.cardStatus !== 'completed' && (
                                                                    <>
                                                                        <div className="remove-button-container">

                                                                            <Trash variant="primary" onClick={handleShow} />

                                                                        </div>
                                                                    </>
                                                                )}

                                                            </>

                                                        ) : (
                                                            <div></div>
                                                        )}

                                                    </div>
                                                ))}

                                            <br />

                                            {taskStatus === 'ongoing' ? (
                                                <>
                                                    <div className="dropdown-and-button-container">
                                                        <select
                                                            value={selectedWorker[taskDetail.taskCardId] || ''}
                                                            onChange={(e) =>
                                                                handleSelectedWorkerChange(taskDetail.taskCardId, e.target.value)
                                                            }
                                                            className="dropdown-input-select-worker"
                                                        >
                                                            <option value="">{t('selectaworker')}</option>
                                                            {workerNames.map((workerName) => (
                                                                <option key={workerName.name} value={workerName.name}>
                                                                    {workerName.name}
                                                                </option>
                                                            ))}
                                                        </select>

                                                        {taskStatus === 'ongoing' ? (
                                                            <>
                                                                {ongoingTaskName === 'Pluck' ? (
                                                                    <input
                                                                        type="number"
                                                                        value={quantityForPluck[taskDetail.taskCardId] || ''}
                                                                        onChange={(e) =>
                                                                            handleQuantityChange(taskDetail.taskCardId, e.target.value)
                                                                        }
                                                                        placeholder="Qty."
                                                                        className="quantity-input"
                                                                        style={{ width: '100px', height: '40px' }}
                                                                    />
                                                                ) : (
                                                                    <div></div>
                                                                )}
                                                            </>
                                                        ) : (
                                                            <div></div>
                                                        )}
                                                    </div>
                                                </>
                                            ) : (
                                                <div></div>
                                            )}
                                        </div>

                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Finance Toggled View */}
                        {selectedView === 'finance' && (

                            <div>
                                {taskExpenses.map((taskExpense) => (
                                    <div key={taskExpense.id} className="task-expense-card">
                                        <h3>{t('expensetype')} : {taskExpense.expenseType}</h3>
                                        <p>{t('amount')} : {taskExpense.value}</p>
                                    </div>
                                ))}
                                <p className='total-display-card'>{t('totaltaskexpenses')}: {t('rs')}{totalAmount}.00</p>
                            </div>

                        )}
                    </>

                )}
            </>

            <br />
            <br />
            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

const mapStateToProps = (state) => ({
    selectedLandId: state.selectedLandId,
});

const mapDispatchToProps = {
    setSelectedLandId: setSelectedLandIdAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(CompletedTask);