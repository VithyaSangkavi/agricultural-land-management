import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css';
import '../css/common.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faCheck, faReopen } from '@fortawesome/free-solid-svg-icons';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { Trash } from 'react-bootstrap-icons';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { alertService } from '../../_services/alert.service';
import { MdArrowBackIos } from "react-icons/md";

const ManageOngoingTask = () => {
    const [t, i18n] = useTranslation();
    const { taskAssignedid } = useParams();

    const history = useHistory();

    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const startDate = localStorage.getItem('StartDate');
    const landId = localStorage.getItem('SelectedLandId')

    const [taskName, setTaskName] = useState('');
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState({});
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState('');
    const [value, setValue] = useState('');
    const [expenseId, setExpenseId] = useState('');
    // const [selectedWorkersList, setSelectedWorkersList] = useState([]);
    const [selectedWorkersList, setSelectedWorkersList] = useState({});

    const [kgValues, setKgValues] = useState('');

    const [ongoingTaskName, setOngoingTaskName] = useState('');
    const [ongoingTaskDate, setOngoingTaskDate] = useState('');
    const [commanTaskDetails, setCommanTaskDetails] = useState([]);
    const [taskDetails, setTaskDetails] = useState([]);
    const [taskStatus, setTaskStatus] = useState('');
    const [newTaskCardId, setNewTaskCardId] = useState('');


    //const [workerId, setWorkerId] = useState('');
    const [taskAssignedId, setTaskAssignedId] = useState('');
    const [lotId, setLotId] = useState('');
    const [quantity, setQuantity] = useState('');

    const [workers, setWorkers] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [workerId, setWorkerId] = useState('');

    const sortedTaskDetails = taskDetails && taskDetails.length > 1
        ? taskDetails.sort((a, b) => new Date(b.date) - new Date(a.date))
        : taskDetails;

    const handleCompleteTask = (taskCardId) => {
        const newStatus = 'completed';
        updateTaskCardStatus(taskCardId, newStatus);
    };

    const handleReopenTask = (taskCardId) => {
        const newStatus = 'reopened';
        updateTaskCardStatus(taskCardId, newStatus);
    };

    const updateTaskCardStatus = (taskCardId, newStatus) => {
        axios.put(`http://localhost:8080/service/master/updateStatus/${taskCardId}`, {
            newStatus,
        })
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(`Error updating TaskCard ${taskCardId} status:`, error);
            });
    };

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
        fetchTaskAssignedId();
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
        fetchLotId();
    }, []);

    useEffect(() => {

        axios.get(`http://localhost:8080/service/master/work-assigned-details/${taskAssignedid}`)
            .then((response) => {
                setTaskDetails(response.data.extra.cardDetails);
                setCommanTaskDetails(response.data.extra);
                setOngoingTaskName(response.data.extra.taskName);
                setTaskStatus(response.data.extra.taskStatus);

                const formattedStartDate = getFormattedDate(response.data.extra.startDate);
                setOngoingTaskDate(formattedStartDate);

                const today = getFormattedDate(new Date());
                const isCardExist = response.data.extra.cardDetails.some(
                    (card) => getFormattedDate(card.date) === today
                );

                if (!isCardExist) {
                    const newEmptyCard = {
                        newTaskCardId,
                        date: new Date(),
                        cardStatus: 'ongoing',
                        workerDetails: [],
                    };

                    setTaskDetails((prevTaskDetails) => [...prevTaskDetails, newEmptyCard]);
                }
            })
            .catch((error) => {
                console.error('Error fetching task details:', error);
            });
    }, []);


    const fetchTaskName = () => {
        axios.get(`http://localhost:8080/service/master/findTaskNameById/?taskId=${taskId}`)
            .then((response) => {
                setTaskName(response.data.extra.taskName);

            })
            .catch((error) => {
                //console.error('Error fetching task name:', error);
            });
    };

    const fetchWorkerNames = () => {
        axios.post('http://localhost:8080/service/master/workerFindAll')
            .then((response) => {
                const workerNamesArray = response.data.extra.map((worker) => worker.name);
                setWorkerNames(workerNamesArray);
            })
            .catch((error) => {
                //console.error('Error fetching worker names:', error);
            });
    };

    const fetchExpenseTypes = () => {
        axios.get('http://localhost:8080/service/master/expenseFindAll')
            .then((response) => {
                const expenseTypeArrays = response.data.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
            })
            .catch((error) => {
                // console.error('Error fetching expenses:', error);
            });
    };

    const fetchTaskAssignedId = () => {
        //get task-assigned id
        axios.get(`http://localhost:8080/service/master/task-assigned?taskId=${taskId}`)
            .then((response) => {
                console.log('Task assigned id: ', response.data.extra.id)
                setTaskAssignedId(response.data.extra.id);
            })
            .catch((error) => {
                console.error('Error fetching task name:', error);
            });
    }

    const fetchLotId = () => {
        axios.get(`http://localhost:8080/service/master/findLotByLandId?landId=${landId}`)
            .then((response) => {
                const thislot = response.data.extra.id;
                console.log('Lot id: ', response.data.extra.id)
                setLotId(thislot);
            })
            .catch((error) => {
                console.error('Error fetching lot id:', error);
            });
    }

    const handleSelectedWorkerChange = (taskCardId, value) => {
        setSelectedWorker((prevSelectedWorkers) => ({
            ...prevSelectedWorkers,
            [taskCardId]: value,
        }));
    };

    const handleAddSelectedWorker = (taskCardId) => {
        const selectedWorkerValue = selectedWorker[taskCardId];

        if (taskName === 'Pluck') {
            console.log('Pluck task')
            if (selectedWorkerValue) {
                console.log('selected worker: ', selectedWorkerValue);
                localStorage.setItem('selectedWorker', selectedWorkerValue);
            }
        } else {
            if (selectedWorkerValue) {
                console.log('selected worker: ', selectedWorkerValue);
                const name = selectedWorkerValue;
                setSelectedWorkersList((prevSelectedWorkers) => ({
                    ...prevSelectedWorkers,
                    [taskCardId]: [...(prevSelectedWorkers[taskCardId] || []), name],
                }));
                setSelectedWorker('');


                axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${name}`)
                    .then((response) => {
                        const workerId = response.data.extra.workerId
                        console.log('Worker ID :', workerId);

                        console.log('New task card id: ', taskCardId)
                        // Check if taskCardId is null
                        if (taskCardId == null) {
                            // If null, it means it's a new card
                            const newTaskCard = {
                                taskAssignedDate: new Date(),
                                taskAssignedId: taskAssignedid
                            };

                            axios.post('http://localhost:8080/service/master/task-card-save', newTaskCard)
                                .then((savedTaskCardResponse) => {
                                    console.log('New Task card added', savedTaskCardResponse.data.extra);
                                    const newtaskCardId = savedTaskCardResponse.data.extra.id

                                    setNewTaskCardId(newtaskCardId);

                                    const addWorkAssigned = {
                                        startDate,
                                        workerId,
                                        taskId,
                                        taskAssignedId: taskAssignedid,
                                        lotId,
                                        taskCardId: newtaskCardId
                                    }

                                    axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                                        .then((response) => {
                                            console.log('Work assigned added successfully:', response.data);
                                            alertService.success('Worker added successfully');
                                            // window.location.reload();
                                        })
                                        .catch((error) => {
                                            console.error('Error adding work assigned:', error);
                                        });



                                })
                                .catch((error) => {
                                    console.error('Error adding new task card:', error);
                                });
                        } else {
                            // If taskCardId is not null, it means it's an existing card, directly assign the worker
                            const addWorkAssigned = {
                                startDate,
                                workerId,
                                taskId,
                                taskAssignedId: taskAssignedid,
                                lotId,
                                taskCardId: taskCardId
                            }

                            axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                                .then((response) => {
                                    console.log('Work assigned added successfully:', response.data);
                                    alertService.success('Worker added successfully');
                                    // window.location.reload();
                                })
                                .catch((error) => {
                                    console.error('Error adding work assigned:', error);
                                });
                        }

                    })
                    .catch((error) => {
                        console.error('Error getting worker id:', error);
                    });
            }
        }
    };

    // add task expense
    const handleAddTaskExpense = () => {

        //get expense id according to the expense type
        axios
            .get(`http://localhost:8080/service/master/find-by-type?expenseType=${selectedExpenseType}`)
            .then((response) => {
                const expenseId = response.data.expenseId;
                setExpenseId(expenseId);

                const addTaskExpense = {
                    value,
                    taskId,
                    expenseId,
                    taskAssignedId: taskAssignedid,
                };

                //save task expense 
                axios.post('http://localhost:8080/service/master/task-expense-save', addTaskExpense)
                    .then((response) => {
                        console.log('Task expense added successfully:', response.data);
                        history.push('/home');
                    })
                    .catch((error) => {
                        // console.error('Error adding task expense:', error);
                    });
            })
            .catch((error) => {
                //console.error('Error fetching expense id:', error);
            });
    }

    const handleKgChange = (e, index) => {
        const updatedKgValues = [...kgValues];
        updatedKgValues[index] = e.target.value;
        setKgValues(updatedKgValues);
        setQuantity(updatedKgValues);
    };

    const addQuantity = () => {

        const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('selected worker: ', selectedWorker);

        axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${selectedWorker}`)
            .then((response) => {
                const workerId = response.data.extra.workerId
                // setWorkerId(storeWorkerId);
                console.log('Worker ID :', workerId);

                const addWorkAssigned = {
                    quantity,
                    startDate,
                    workerId,
                    taskId,
                    taskAssignedId,
                    lotId
                }

                axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                    .then((response) => {
                        console.log('Work assigned added successfully:', response.data);

                    })
                    .catch((error) => {
                        console.error('Error adding work assigned:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
            });
    }

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const EndTask = () => {
        const details = {
            newStatus: 'completed',
        }

        axios.put(`http://localhost:8080/service/master/updateEndDate/${taskAssignedid}`, details)
            .then((response) => {
                window.location.reload();
            })
            .catch((error) => {
                console.error(`Error updating endDate`, error);
            });
    }

    const formattedEndDate = getFormattedDate(commanTaskDetails.endDate);

    const handleRemoveWorker = (taskCardId, workAssignedId) => {

        axios.delete(`http://localhost:8080/service/master/work-assigned-delete/${workAssignedId}`)
            .then(response => {
                console.log('Worker removed successfully:', response.data);
                window.location.reload();
            })
            .catch(error => {
                console.error('Error removing worker:', error);
            });
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="manage-task-app-screen">
            <div className='main-heading'>

                <div className="outer-frame d-flex justify-content-between align-items-center">
                    <div className="filter-container d-flex align-items-center">
                        <MdArrowBackIos className="back-button" onClick={goBack} />
                    </div>

                    <div className="filter-container d-flex align-items-center">
                        <div className="land-filter">

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

            {selectedView === 'tasks' && (
                <div className='card-container'>
                    {taskDetails.map((taskDetail) => (
                        <div key={taskDetail.taskCardId} className='card'>
                            <p>{t('date')} - <h6>{getFormattedDate(taskDetail.date)}</h6></p>
                            <h6> Current Staus - {taskDetail.cardStatus}</h6>
                            <p>---------------------------------------------</p>

                            {taskDetail.workerDetails
                                .map((workerDetail) => (
                                    <div key={workerDetail.id} className="worker-details">
                                        <div className="worker-name-container">
                                            {ongoingTaskName === 'Pluck' ? (
                                                <p>
                                                    {workerDetail.workerName} - {workerDetail.quantity}
                                                    {workerDetail.units}
                                                </p>
                                            ) : (
                                                <p>{workerDetail.workerName}</p>
                                            )}
                                        </div>


                                        {taskStatus === 'ongoing' ? (
                                            <>

                                                {taskDetail.cardStatus !== 'completed' && (
                                                    <div className="remove-button-container">
                                                        <Trash onClick={() => handleRemoveWorker(taskDetail.taskCardId, workerDetail.workAssigned)} />
                                                    </div>
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
                                                <option key={workerName} value={workerName}>
                                                    {workerName}
                                                </option>
                                            ))}
                                        </select>

                                        {taskStatus === 'ongoing' ? (
                                            <>
                                                <button className='add-small' onClick={() => handleAddSelectedWorker(taskDetail.taskCardId)}>
                                                    {t('add')}
                                                </button>

                                                {taskDetail.cardStatus === 'completed' ? (
                                                    <button className="reopen-button" onClick={() => handleReopenTask(taskDetail.taskCardId)}>
                                                        Reopen
                                                    </button>
                                                ) : (
                                                    <button className="complete-button" onClick={() => handleCompleteTask(taskDetail.taskCardId)}>
                                                        Complete
                                                    </button>
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

                            {selectedWorkersList[taskDetail.taskCardId]?.length > 0 && (
                                <div>
                                    {selectedWorkersList[taskDetail.taskCardId].map((worker, index) => (
                                        <div key={index} className="worker-container">
                                            <p>{worker}</p>
                                            {taskName === 'Pluck' && (
                                                <div className="kg-input-container">
                                                    <div className="kg-input">
                                                        <input
                                                            type="text"
                                                            placeholder={t('numberofkg')}
                                                            value={kgValues[index] || ''}
                                                            onChange={(e) => handleKgChange(e, index)}
                                                            className="dropdown-input"
                                                        />
                                                        <span className="add-kg-icon">
                                                            <FontAwesomeIcon icon={faPlus} onClick={addQuantity} />
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                    ))}
                </div>
            )}


            {/* Finance Toggled View */}
            {selectedView === 'finance' && (
                <div>
                    <select
                        value={selectedExpenseType}
                        onChange={(e) => setSelectedExpenseType(e.target.value)}
                        className='dropdown-input'
                    >
                        <option value="">{t('expense')}</option>
                        {expenseTypes.map((expenseType) => (
                            <option key={expenseType} value={expenseType}>
                                {expenseType}
                            </option>
                        ))}
                    </select><br />
                    <input
                        type="text"
                        placeholder={t('amount')}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="dropdown-input"
                    />
                    <button className="add-button" onClick={handleAddTaskExpense}>{t('addtaskexpense')}</button>
                </div>
            )}

            <br />

            <div className="container">
                {taskStatus === 'ongoing' ? (
                    <button className="end-task" onClick={EndTask}>End-Task</button>
                ) : (
                    <div></div>
                )}
            </div>

            <br /><br /><br />

            <br />
            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

export default ManageOngoingTask;