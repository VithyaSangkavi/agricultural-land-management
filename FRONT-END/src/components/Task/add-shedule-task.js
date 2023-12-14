import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MultiDatePicker from "react-multi-date-picker";
import { useLocation } from 'react-router-dom';
import { MdArrowBackIos } from "react-icons/md";


const ManageTask = () => {

    const location = useLocation();
    const { selectedDates } = location.state || {};
    const { taskAssignedId } = location.state || {};

    const [formattedDates, setFormattedDates] = useState([]);
    const [currentDate, setCurrentDate] = useState(Array(selectedDates.length).fill(''));

    const [t, i18n] = useTranslation();

    const history = useHistory();

    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const landId = localStorage.getItem('SelectedLandId')
    const startDate = localStorage.getItem('StartDate');

    const [taskName, setTaskName] = useState('');
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);

    // const [selectedWorker, setSelectedWorker] = useState('');
    const [selectedWorker, setSelectedWorker] = useState(Array(selectedDates.length).fill(''));
    const [selectedWorkersLists, setSelectedWorkersLists] = useState(Array(selectedDates.length).fill([]));

    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState('');
    const [value, setValue] = useState('');
    const [expenseId, setExpenseId] = useState('');
    const [selectedWorkersList, setSelectedWorkersList] = useState([]);
    const [kgValues, setKgValues] = useState('');
    //const [workerId, setWorkerId] = useState('');
    // const [taskAssignedId, setTaskAssignedId] = useState('');
    const [lotId, setLotId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [taskCardId, setTaskCardId] = useState('');
    const thisid = localStorage.getItem('taskassignedid')
    const [workers, setWorkers] = useState([]);


    console.log("Selected Dates : ", selectedDates)

    useEffect(() => {
        const formattedDatesArray = selectedDates.map(dateObject => {
            const year = dateObject.year;
            const month = dateObject.month.index + 1;
            const day = dateObject.day;
            const formattedDate = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            return formattedDate;
        });

        setFormattedDates(formattedDatesArray);
        setCurrentDate(formattedDatesArray); // Initialize currentDate with formattedDatesArray
    }, [selectedDates]);


    console.log("Formatted date page 02: ", formattedDates)

    const taskAssignedDate = startDate;

    useEffect(() => {
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
        fetchLotId();
        console.log('check task assigned id: ', thisid);
    }, []);

    const fetchTaskName = () => {
        axios.get(`http://localhost8081/service/master/findTaskNameById/?taskId=${taskId}`)
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

        //get task-assigned id
        //axios.get(`http://localhost:8080/service/master/task-assigned?taskId=${taskId}`)

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

        if (!taskCardId) {
            const saveTaskCard = {
                taskAssignedDate,
                taskAssignedId,
            };

            axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
                .then((response) => {
                    console.log('Task card added', response.data);
                    localStorage.setItem('taskassignedid', taskAssignedId);

                    axios.get(`http://localhost:8080/service/master/taskCardFindById?taskAssignedId=${taskAssignedId}`)
                        .then((response) => {
                            const taskCardId = response.data.extra.id;

                            console.log('Task card id: ', taskCardId);
                            setTaskCardId(taskCardId);

                            addWorkerToTaskCard(taskCardId);
                        })
                        .catch((error) => {
                            console.error('Error fetching task card id:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error adding task card:', error);
                });
        } else {
            addWorkerToTaskCard(taskCardId);
        }

    }

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleTaskCard = () => {
        const saveTaskCard = {
            taskAssignedDate,
            taskAssignedId
        }

        axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
            .then((response) => {
                console.log('task card added', response.data)
            })
            .catch((error) => {
                console.error('Error adding task card:', error);
            });
    }

    const removeWorker = (index) => {
        const workerName = selectedWorkersList[index];

        deleteItem(workerName);

        const updatedWorkersList = [...selectedWorkersList];
        updatedWorkersList.splice(index, 1);
        setSelectedWorkersList(updatedWorkersList);
    }

    const deleteItem = (workerName) => {
        axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${workerName}`)
            .then((response) => {
                const thisid = response.data.extra.workerId
                console.log("Delete")
                console.log('workerid:', response.data.extra.workerId);
                console.log('Task card id: ', taskCardId)

                axios.delete(`http://localhost:8080/service/master/work-assigned-delete/${thisid}/${taskCardId}`)
                    .then((response) => {
                        console.log('worker assigned removed successfully:', response.data);

                    })
                    .catch((error) => {
                        console.error('Error getting worker id:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
            });
    };

    ////////// NEW //////////////////

    const handleAddSelectedWorker = (dateIndex) => {
        if (taskName === 'Pluck') {
            console.log('Pluck task');
            if (selectedWorker[dateIndex]) {
                setSelectedWorkersList([...selectedWorkersList, selectedWorker[dateIndex]]);
                const selectedWorkerName = selectedWorker[dateIndex];
                saveTaskCardAndWorker(dateIndex, selectedWorkerName);
            }
        } else {
            if (selectedWorker[dateIndex]) {
                setSelectedWorkersList([...selectedWorkersList, selectedWorker[dateIndex]]);
                const selectedWorkerName = selectedWorker[dateIndex];
                saveTaskCardAndWorker(dateIndex, selectedWorkerName);
            }
        }

        const newSelectedWorkersList = [...selectedWorkersLists[dateIndex], selectedWorker[dateIndex]];
        const updatedSelectedWorkersLists = [...selectedWorkersLists];
        updatedSelectedWorkersLists[dateIndex] = newSelectedWorkersList;
        setSelectedWorkersLists(updatedSelectedWorkersLists);
    }

    const saveTaskCardAndWorker = (dateIndex, selectedWorkerName) => {
        // Check if the task card is already saved
        if (!taskCardId[dateIndex]) {
            const saveTaskCard = {
                taskAssignedDate,
                taskAssignedId,
                workDate: currentDate[dateIndex]
            };

            axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
                .then((response) => {
                    console.log('Task card added', response.data);
                    const newTaskCardId = response.data.extra.id;

                    // Update the taskCardId state for the specific dateIndex
                    const updatedTaskCardIds = [...taskCardId];
                    updatedTaskCardIds[dateIndex] = newTaskCardId;
                    setTaskCardId(updatedTaskCardIds);

                    // Save worker to the task card
                    addWorkerToTaskCard(newTaskCardId, selectedWorkerName);
                })
                .catch((error) => {
                    console.error('Error adding task card:', error);
                });
        } else {
            // Save worker to the existing task card
            addWorkerToTaskCard(taskCardId[dateIndex], selectedWorkerName);
        }
    }

    const addWorkerToTaskCard = (taskCardId, selectedWorkerName) => {
        axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${selectedWorkerName}`)
            .then((response) => {
                const workerId = response.data.extra.workerId;
                console.log('Worker ID:', workerId);
                console.log('TaskID:', taskId)

                const addWorkAssigned = {
                    startDate,
                    workerId,
                    taskId: taskId,
                    taskAssignedId,
                    lotId: 1,
                    taskCardId: taskCardId,
                };

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

    /////////// END /////////////////

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="manage-task-app-screen">
            <div className="header-bar">
                <MdArrowBackIos className="back-button" onClick={goBack}/>
                <p className="main-heading">Scheduled Task</p>
                <div className="position-absolute top-0 end-0 me-0">
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

            <div className='task-heading'>
                <p> {taskName} {t('task')} - </p>
                <p> {t('from')} - {startDate} </p>
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
                {selectedDates.map((date, dateIndex) => (
                    <div key={dateIndex}>
                        {selectedView === 'tasks' && (
                            <div className='card'>
                                <p>{t('date')}: {formattedDates[dateIndex]}</p><br />

                                {/* <div className="dropdown-and-button-container">
                                    <select
                                        value={selectedWorker}
                                        onChange={(e) => setSelectedWorker(e.target.value)}
                                        className='dropdown-input'
                                    >
                                        <option value="">{t('selectaworker')}</option>
                                        {workerNames.map((workerName, index) => (
                                            <option key={index} value={workerName}>
                                                {workerName}
                                            </option>
                                        ))}
                                    </select>
                                    <button className='add-small' onClick={handleAddSelectedWorker}>{t('add')}</button>
                                </div> */}

                                <div className="dropdown-and-button-container">
                                    <select
                                        value={selectedWorker[dateIndex]}
                                        onChange={(e) => {
                                            const newSelectedWorkers = [...selectedWorker];
                                            newSelectedWorkers[dateIndex] = e.target.value;
                                            setSelectedWorker(newSelectedWorkers);
                                        }}
                                        className='dropdown-input'
                                    >
                                        <option value="">{t('selectaworker')}</option>
                                        {workerNames.map((workerName, index) => (
                                            <option key={index} value={workerName}>
                                                {workerName}
                                            </option>
                                        ))}
                                    </select>
                                    <button className='add-small' onClick={() => handleAddSelectedWorker(dateIndex)}>{t('add')}</button>
                                </div>

                                {selectedWorkersList.length > 0 && (
                                    <div>
                                        {selectedWorkersLists[dateIndex].map((worker, index) => (
                                            <div key={index} className="worker-container">
                                                <div className='line'>
                                                    <p>{worker}</p>
                                                    <button onClick={() => removeWorker(index)} className="delete-button">
                                                        <FontAwesomeIcon icon={faTrashAlt} />
                                                    </button>
                                                </div>
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
                        )}
                    </div>
                ))}
            </>



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
            <br /><br /><br />

            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    );
};

export default ManageTask;