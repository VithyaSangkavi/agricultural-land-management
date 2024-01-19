import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import './manage-task.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import MultiDatePicker from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel"
import moment from 'moment'
import "react-multi-date-picker/styles/layouts/prime.css"
import { MdArrowBackIos, MdViewAgenda, MdClose } from "react-icons/md";
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { useLocation } from 'react-router-dom';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { alertService } from '../../_services/alert.service';
import { IoMdClose } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { submitSets } from '../UiComponents/SubmitSets';
import { submitCollection } from '../../_services/submit.service';

const ManageTask = ({ selectedLandId }) => {

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);


    const [t, i18n] = useTranslation();
    const history = useHistory();
    const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    const startDate = localStorage.getItem('StartDate');

    const [taskName, setTaskName] = useState('');
    const [selectedView, setSelectedView] = useState('tasks');
    const [workerNames, setWorkerNames] = useState([]);
    const [selectedWorker, setSelectedWorker] = useState('');
    const [expenseTypes, setExpenseTypes] = useState([]);
    const [selectedExpenseType, setSelectedExpenseType] = useState('');
    const [value, setValue] = useState('');
    const [expenseId, setExpenseId] = useState('');
    const [selectedWorkersList, setSelectedWorkersList] = useState([]);
    const [kgValues, setKgValues] = useState([]);
    //const [workerId, setWorkerId] = useState('');
    const [lotId, setLotId] = useState('');
    const [quantity, setQuantity] = useState('');
    const [taskCardId, setTaskCardId] = useState('');
    const [workers, setWorkers] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [formattedDates, setFormattedDates] = useState([]);
    const [taskExpenses, setTaskExpenses] = useState([]);
    const [showExpenses, setShowExpenses] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const datePickerRef = useRef(null);

    const location = useLocation();
    const taskAssignedId = location.state?.taskAssignedId || null;

    console.log("task id : ", taskAssignedId)

    const handleShedule = (value) => {

        const newStatus = 'scheduled'

        axios.post(`http://localhost:8080/service/master/updateSchedulStatus/${taskAssignedId}`, {
            newStatus,
        })
            .then((response) => {

            })
            .catch((error) => {
                console.error(`Error updating TasskAssignedStatus ${taskAssignedId} status:`, error);
            });

        console.log("Dates: ", value);
        setSelectedDates(value);

        history.push({
            pathname: '/addsheduledtask',
            state: { selectedDates, taskAssignedId },
        })

    };

    const taskAssignedDate = startDate;

    useEffect(() => {
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
        fetchLotId();
    }, []);

    const fetchTaskName = () => {
        // axios.get(`http://localhost:8080/service/master/findTaskNameById/?taskId=${taskId}`)
        submitSets(submitCollection.findTaskNameById, "/?taskId=" + taskId, true)
            .then((response) => {
                setTaskName(response.extra.taskName);
            })
            .catch((error) => {
                //console.error('Error fetching task name:', error);
            });
    };

    //fetch worker names according to the landId
    const fetchWorkerNames = () => {

        // axios.get(`http://localhost:8080/service/master/findWorkersByLandId?landId=${selectedLandId}`)
        submitSets(submitCollection.findWorkersByLandId, "?landId=" + selectedLandId, true)

            .then((response) => {
                const workerNamesArray = response.extra.map((worker) => worker.name);
                setWorkerNames(workerNamesArray);
            })
            .catch((error) => {
                //console.error('Error fetching worker names:', error);
            });
    };

    const fetchExpenseTypes = () => {
        // axios.get('http://localhost:8080/service/master/expenseFindAll')
        submitSets(submitCollection.manageexpense, true)
            .then((response) => {
                const expenseTypeArrays = response.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
            })
            .catch((error) => {
                // console.error('Error fetching expenses:', error);
            });
    };

    const fetchLotId = () => {
        // axios.get(`http://localhost:8080/service/master/findLotByLandId?landId=${selectedLandId}`)
        submitSets(submitCollection.findLotByLandId, '?landId=' + selectedLandId, true)
            .then((response) => {
                const thislot = response.extra.id;
                console.log('Lot id: ', response.extra.id)
                setLotId(thislot);
            })
            .catch((error) => {
                console.error('Error fetching lot id:', error);
            });
    }

    const handleKgChange = (e, index) => {
        const updatedKgValues = [...kgValues];
        updatedKgValues[index] = e.target.value;
        setKgValues(updatedKgValues);
        const kg = e.target.value;
        setQuantity(kg);
    };

    const handleAddSelectedWorker = () => {

        if (taskName === 'Pluck') {
            console.log('Pluck task')
            if (selectedWorker) {

                if (selectedWorkersList.includes(selectedWorker)) {
                    alertService.warn('Worker has already been added for this date.');
                    return;
                }

                setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
                setSelectedWorker('');
                console.log('selected worker: ', selectedWorker);
                localStorage.setItem('selectedWorker', selectedWorker);
                if (selectedWorker) {
                    setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
                    setSelectedWorker('');
                    console.log('selected worker: ', selectedWorker);

                    if (!taskCardId) {
                        const saveTaskCard = {
                            taskAssignedDate,
                            taskAssignedId,
                        };

                        // axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
                        submitSets(submitCollection.task_card_save, saveTaskCard, true)
                            .then((response) => {
                                console.log('Task card added', response);
                                localStorage.setItem('taskassignedid', taskAssignedId);

                                // axios.get(`http://localhost:8080/service/master/taskCardFindById?taskAssignedId=${taskAssignedId}`)
                                submitSets(submitCollection.taskCardFindById, '?taskAssignedId=' + taskAssignedId, true)


                                    .then((response) => {
                                        const taskCardId = response.extra.id;

                                        console.log('Task card id: ', taskCardId);
                                        setTaskCardId(taskCardId);

                                        addWorkerToPluckTaskCard(taskCardId);
                                    })
                                    .catch((error) => {
                                        console.error('Error fetching task card id:', error);
                                    });
                            })
                            .catch((error) => {
                                console.error('Error adding task card:', error);
                            });
                    } else {
                        addWorkerToPluckTaskCard(taskCardId);
                    }
                }
            }
        } else {
            if (selectedWorker) {

                if (selectedWorkersList.includes(selectedWorker)) {
                    alertService.warn('Worker has already been added for this date.');
                    return;
                }

                setSelectedWorkersList([...selectedWorkersList, selectedWorker]);
                setSelectedWorker('');
                console.log('selected worker: ', selectedWorker);
                setSelectedWorker(selectedWorker);

                if (!taskCardId) {
                    const saveTaskCard = {
                        taskAssignedDate,
                        taskAssignedId,
                    };

                    // axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
                    submitSets(submitCollection.task_card_save, saveTaskCard, true)
                        .then((response) => {
                            console.log('Task card added', response);
                            localStorage.setItem('taskassignedid', taskAssignedId);

                            // axios.get(`http://localhost:8080/service/master/taskCardFindById?taskAssignedId=${taskAssignedId}`)
                            submitSets(submitCollection.taskCardFindById, '?taskAssignedId=' + taskAssignedId, true)

                                .then((response) => {
                                    const taskCardId = response.extra.id;

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
        }
    }

    const addWorkerToPluckTaskCard = (taskCardId) => {
        
        const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('add -> selected worker pluck task: ', selectedWorker);
        console.log('Quantity: ', quantity);

        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
        let sendobj = submitCollection.findWorkerIdByName;
        sendobj.url = (sendobj.url + '?name=' + selectedWorker);

        //axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${selectedWorker}`)
        submitSets(submitCollection.findWorkerIdByName, true)
            .then((response) => {
                const workerId = response.extra.workerId
                console.log('Worker ID :', workerId);

                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url

                const addWorkAssigned = {
                    startDate,
                    workerId,
                    quantity,
                    taskId,
                    taskAssignedId,
                    lotId,
                    taskCardId,
                };

                // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)

                    .then((response) => {
                        console.log('Work assigned added successfully:', response);
                        setQuantity('')
                    })
                    .catch((error) => {
                        console.error('Error adding work assigned:', error);
                    });
            })

            .catch((error) => {
                console.error('Error getting worker id:', error);
            });
    }

    const addWorkerToTaskCard = (taskCardId) => {

        // const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('add -> selected worker: ', selectedWorker);

        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
        let sendobj = submitCollection.findWorkerIdByName;
        sendobj.url = (sendobj.url + '?name=' + selectedWorker);


        //axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${selectedWorker}`)
        submitSets(submitCollection.findWorkerIdByName, true)

            .then((response) => {
                const workerId = response.extra.workerId
                console.log('Worker ID :', workerId);

                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url
                const addWorkAssigned = {
                    startDate,
                    workerId,
                    taskId,
                    taskAssignedId,
                    lotId,
                    taskCardId,
                };

                // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)

                    .then((response) => {
                        console.log('Work assigned added successfully:', response);
                    })
                    .catch((error) => {
                        console.error('Error adding work assigned:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
            });
    }

    // add task expense
    const handleAddTaskExpense = () => {

        //get expense id according to the expense type

        // axios.get(`http://localhost:8080/service/master/find-by-type?expenseType=${selectedExpenseType}`)
        submitSets(submitCollection.find_by_type, '?expenseType=' + selectedExpenseType, true)

            .then((response) => {
                const expenseId = response.expenseId;
                setExpenseId(expenseId);

                const addTaskExpense = {
                    value,
                    taskAssignedId,
                    taskId,
                    expenseId,
                };

                //save task expense 
                // axios.post('http://localhost:8080/service/master/task-expense-save', addTaskExpense)
                submitSets(submitCollection.task_expense_save, addTaskExpense, true)

                    .then((response) => {
                        console.log('Task expense added successfully:', response);
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

    const addQuantity = () => {

        // const selectedWorker = localStorage.getItem('selectedWorker');
        console.log('selected worker: ', selectedWorker);

        if (!taskCardId) {
            const saveTaskCard = {
                taskAssignedDate,
                taskAssignedId,
            };

            // axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
            submitSets(submitCollection.task_card_save, saveTaskCard, true)
                .then((response) => {
                    console.log('Task card added', response);
                    localStorage.setItem('taskassignedid', taskAssignedId);

                    // axios.get(`http://localhost:8080/service/master/taskCardFindById?taskAssignedId=${taskAssignedId}`)
                    submitSets(submitCollection.taskCardFindById, '?taskAssignedId=' + taskAssignedId, true)

                        .then((response) => {
                            const taskCardId = response.extra.id;

                            console.log('Task card id: ', taskCardId);
                            setTaskCardId(taskCardId);

                            addWorkerToPluckTaskCard(taskCardId);
                        })
                        .catch((error) => {
                            console.error('Error fetching task card id:', error);
                        });
                })
                .catch((error) => {
                    console.error('Error adding task card:', error);
                });
            addWorkerToPluckTaskCard(taskCardId);
        } else {
            addWorkerToPluckTaskCard(taskCardId);
        }

    }

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleTaskCard = () => {
        const saveTaskCard = {
            taskAssignedDate,
            taskAssignedId,
        }

        // axios.post('http://localhost:8080/service/master/task-card-save', saveTaskCard)
        submitSets(submitCollection.task_card_save, saveTaskCard, true)
            .then((response) => {
                console.log('task card added', response)
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
        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
        let sendobj = submitCollection.findWorkerIdByName;
        sendobj.url = (sendobj.url + '?name=' + workerName);
        //axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${workerName}`)
            submitSets(submitCollection.findWorkerIdByName, true)

            .then((response) => {
                const thisid = response.extra.workerId
                console.log('Worker ID :', thisid);

                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url

                console.log('Task card id: ', taskCardId)

                axios.delete(`http://localhost:8080/service/master/work-assigned-delete/${thisid}/${taskCardId}`)
                    .then((response) => {
                        console.log('worker assigned removed successfully:', response);

                    })
                    .catch((error) => {
                        console.error('Error getting worker id:', error);
                    });
            })
            .catch((error) => {
                console.error('Error getting worker id:', error);
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

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="manage-task-app-screen">
            <Header />
            <div className='task-heading'>
                <p> {taskName} {t('task')} - </p>
                <p> {t('from')} - {getFormattedDate(startDate)} </p>
            </div>

            <br />


            <>
                <Button className="add-button" onClick={handleShow}>
                    Select Dates to Schedule
                </Button>

                <Modal
                    show={show}
                    onHide={handleClose}
                    animation={false}
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                >
                    <Modal.Header>
                        <Modal.Title>Select Dates</Modal.Title>
                        <Button variant="secondary" style={{ backgroundColor: '#0e4f20' }} onClick={handleShedule}
                            disabled={selectedDates.length === 0}>
                            Schedule
                        </Button>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Header>
                    <Modal.Body>
                        <MultiDatePicker
                            className="rmdp-prime"
                            placeholder='Choose Dates'
                            value={selectedDates}
                            onChange={setSelectedDates}
                            format='DD/MM/YYYY'
                            plugins={[
                                <DatePanel />
                            ]}
                            ref={datePickerRef}
                        />
                    </Modal.Body>
                </Modal>
            </>

            <br />   <br />
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
                <div className='card'>
                    <p>{t('date')}: {getFormattedDate(startDate)}</p><br />

                    <div className="dropdown-and-button-container">
                        <select
                            value={selectedWorker}
                            onChange={(e) => setSelectedWorker(e.target.value)}
                            className='dropdown-input-select-worker'
                        >
                            <option value="">{t('selectaworker')}</option>
                            {workerNames.map((workerName) => (
                                <option key={workers.name} value={workerName}>
                                    {workerName}
                                </option>
                            ))}
                        </select>
                        <button className='add-small' onClick={handleAddSelectedWorker}>{t('add')}</button>
                    </div>
                    {selectedWorkersList.length > 0 && (
                        <div className='worker-container'>
                            {selectedWorkersList.map((worker, index) => (
                                <div key={index} className='line'>
                                    <div className='line-two'>
                                        <p>{worker}</p>

                                        <button onClick={() => removeWorker(index)}>
                                            <IoMdClose />
                                        </button>
                                    </div>
                                    {taskName === 'Pluck' && (
                                        <div className="kg-input-container">
                                            <div className="kg-input">
                                                <input
                                                    type="number"
                                                    placeholder={t('numberofkg')}
                                                    value={kgValues[index] || ''}
                                                    onChange={(e) => handleKgChange(e, index)}
                                                    className="quantity-input"
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

            {/* Finance Toggled View */}
            {selectedView === 'finance' && (
                <>
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
                    <br />
                    <div>
                        {showExpenses ? (
                            <button onClick={() => setShowExpenses(false)} className='view-task-expenses'>
                                <MdClose /> {t('closetaskexpenses')}
                            </button>
                        ) : (
                            <button onClick={() => setShowExpenses(true)} className='view-task-expenses'>
                                <MdViewAgenda /> {t('viewtaskexpenses')}
                            </button>
                        )}

                        {/* Display task expenses when showExpenses is true */}
                        {showExpenses && (
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

                    </div>
                </>
            )}
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

export default connect(mapStateToProps, mapDispatchToProps)(ManageTask);