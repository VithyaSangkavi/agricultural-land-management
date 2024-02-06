import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import Header from '../header/header';
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
import { MdArrowBackIos, MdViewAgenda, MdClose } from "react-icons/md";
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { submitSets } from '../UiComponents/SubmitSets';
import { submitCollection } from '../../_services/submit.service';

const ManageOngoingTask = ({ selectedLandId }) => {
    const [show, setShow] = useState(false);
    const [deleteWorkerName, setDeleteWorkerName] = useState('')
    const [deleteWorkerId, setDeleteWorkerId] = useState('')


    const handleClose = () => setShow(false);
    const handleShow = (workerName, workAssigned) => {
        setDeleteWorkerName(workerName);
        setDeleteWorkerId(workAssigned)
        setShow(true);
        console.log("Delete worker : ", deleteWorkerName)
        console.log("Delete worker : ", deleteWorkerId)
    };



    const [t, i18n] = useTranslation();
    const { taskAssignedid, taskId } = useParams();

    console.log("Task assigned : ", taskAssignedid);
    console.log("task id : ", taskId);

    const history = useHistory();

    // const taskId = localStorage.getItem('TaskIDFromTaskAssigned')
    // const startDate = localStorage.getItem('StartDate');
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
    const [workerDetailsList, setWorkerDetails] = useState([]);
    const [taskStatus, setTaskStatus] = useState('');
    const [newTaskCardId, setNewTaskCardId] = useState('');
    const [taskExpenses, setTaskExpenses] = useState([]);

    //const [workerId, setWorkerId] = useState('');
    // const [taskAssignedId, setTaskAssignedId] = useState('');
    const [lotId, setLotId] = useState('');
    const [quantity, setQuantity] = useState('');

    const [workers, setWorkers] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);
    const [completedTasks, setCompletedTasks] = useState([]);
    const [workerId, setWorkerId] = useState('');
    const [showExpenses, setShowExpenses] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [quantityForPluck, setQuantityForPluck] = useState({});
    const [startDate, setStartDate] = useState('');



    const sortedTaskDetails = taskDetails && taskDetails.length > 1
        ? taskDetails.sort((a, b) => new Date(b.date) - new Date(a.date))
        : taskDetails;

    useEffect(() => {
        if (showExpenses) {
            getTaskExpenses();
        }
    }, [showExpenses]);

    useEffect(() => {
        const calculateTotalAmount = () => {
            const total = taskExpenses.reduce((acc, expense) => acc + expense.value, 0);
            setTotalAmount(total);

            console.log('Total amount: ', total);
        };

        calculateTotalAmount();
    }, [taskExpenses]);

    const handleCompleteTask = (taskCardId) => {
        const newStatus = 'completed';
        updateTaskCardStatus(taskCardId, newStatus);
    };

    const handleReopenTask = (taskCardId) => {
        const newStatus = 'reopened';
        updateTaskCardStatus(taskCardId, newStatus);
    };

    const updateTaskCardStatus = (taskCardId, newStatus) => {

        // axios.post(`http://localhost:8080/service/master/updateStatus?taskCardId=${taskCardId}`, {
        //     newStatus,
        // })

        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.updateStatus));
        let sendobj = submitCollection.updateStatus;
        sendobj.url = (sendobj.url + '?taskCardId=' + taskCardId);


        submitSets(submitCollection.updateStatus, { newStatus }, true,)
            .then((response) => {


                console.log(response);
                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url
                window.location.reload()
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
        console.log('USE EFFECT TASK ID: ', taskId);
        // fetchTaskAssignedId();
        fetchTaskName();
        fetchWorkerNames();
        fetchExpenseTypes();
        fetchLotId();
        AddedWorkerList();
    }, [selectedLandId]);

    const AddedWorkerList = () => {

        // axios.get(`http://localhost:8080/service/master/work-assigned-details/${taskAssignedid}`)
        submitSets(submitCollection.work_assigned_details, "/" + taskAssignedid, true)
            .then((response) => {

                setTaskDetails(response.extra.cardDetails);
                // setWorkerDetails(response.data.extra.cardDetails.workerDetails)
                setCommanTaskDetails(response.extra);
                setOngoingTaskName(response.extra.taskName);
                setTaskStatus(response.extra.taskStatus);
                const workerNames = [...new Set(response.extra.cardDetails.flatMap(card => card.workerDetails.map(worker => worker.workerName)))];
                console.log(workerNames)
                console.log("st : ", response.extra.startDate)

                const formattedStartDate = getFormattedDate(response.extra.startDate);
                setOngoingTaskDate(formattedStartDate);

                const today = getFormattedDate(new Date());
                const isCardExist = response.extra.cardDetails.some(
                    (card) => getFormattedDate(card.date) === today
                );

                //axios.get(`http://localhost:8080/service/master/taskAssignedFindById?taskAssignedId=${taskAssignedid}`)
                     submitSets(submitCollection.taskAssignedFindById, '?taskAssignedId=' + taskAssignedid, true)
                    .then((taskResponse) => {
                        const schedule = taskResponse.extra.schedule;
                        setStartDate(taskResponse.extra.startDate);
                        console.log('SCHEDULE ::::::: ', schedule)
                        if (schedule !== 'scheduled' && !isCardExist) {
                            // If the task is not scheduled and the card for today doesn't exist, generate a new card
                            const newEmptyCard = {
                                newTaskCardId,
                                date: new Date(),
                                cardStatus: 'ongoing',
                                workerDetails: [],
                            };

                            setTaskDetails((prevTaskDetails) => [...prevTaskDetails, newEmptyCard]);
                        }
                    })
                    .catch((taskError) => {
                        console.error('Error fetching task schedule:', taskError);
                    });
            })
            .catch((error) => {
                console.error('Error fetching task details:', error);
            });
    };


    const fetchTaskName = () => {
       // axios.get(`http://localhost:8080/service/master/findTaskNameById?taskId=${taskId}`)
            submitSets(submitCollection.findTaskNameById, '?taskId=' + taskId, true)
            .then((response) => {

                setTaskName(response.extra.taskName);

            })
            .catch((error) => {
                //console.error('Error fetching task name:', error);
            });
    };

    //fetch worker names according to landId

    console.log("land id :", selectedLandId)

    const fetchWorkerNames = () => {

        // axios.get(`http://localhost:8080/service/master/findWorkersByLandId?landId=${selectedLandId}`)
        submitSets(submitCollection.findWorkersByLandId, "?landId=" + selectedLandId, true)

            .then((response) => {
                console.log("worker names : ", response.extra);
                setWorkerNames(response.extra);
            })
            .catch((error) => {
                console.error('Error fetching worker names:', error);
            });
    };

    const fetchExpenseTypes = () => {
        // axios.get('http://localhost:8080/service/master/expenseFindAll')
        submitSets(submitCollection.manageexpense, false)
            .then((response) => {
                const expenseTypeArrays = response.extra.map((expense) => expense.expenseType);
                setExpenseTypes(expenseTypeArrays);
                console.log('expense types from array: ', expenseTypes);
            })
            .catch((error) => {
                console.error('Error fetching expenses:', error);
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

    console.log("11 : ", taskDetails)

    const handleAddSelectedWorker = (taskCardId) => {

        const selectedWorkerValue = selectedWorker[taskCardId];

        const isWorkerAlreadyAdded = taskDetails.find(
            (taskDetail) => taskDetail.taskCardId === taskCardId && taskDetail.workerDetails.some((worker) => worker.workerName === selectedWorkerValue)
        );

        if (isWorkerAlreadyAdded) {
            alertService.warn(`Worker has already been added for this date.`);
            return;
        }

        if (ongoingTaskName === 'Pluck') {
            console.log('Pluck task');
            if (selectedWorkerValue) {
                console.log('selected worker: ', selectedWorkerValue);
                const name = selectedWorkerValue;
                const quantity = quantityForPluck[taskCardId];

                if (quantity === undefined) {
                    alertService.warn('Quantity is required for Pluck task.')
                    return 0;
                }

                if (
                    selectedWorkersList[taskCardId] &&
                    selectedWorkersList[taskCardId].some((worker) => worker.name === name)
                ) {
                    alertService.warn('Worker already added.');
                    return 0;
                }

                setSelectedWorkersList((prevSelectedWorkers) => ({
                    ...prevSelectedWorkers,
                    [taskCardId]: [
                        ...(prevSelectedWorkers[taskCardId] || []),
                        { name, quantity },
                    ],
                }));
                setSelectedWorker('');

                // axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${name}`)

                let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
                let sendobj = submitCollection.findWorkerIdByName;
                sendobj.url = (sendobj.url + '?name=' + name);

                submitSets(submitCollection.findWorkerIdByName, true)
                    .then((response) => {
                        console.log("save worker : ", response);

                        const workerId = response.extra.workerId;

                        console.log('Worker ID:', workerId);
                        console.log('New task card id: ', taskCardId);

                        console.log(sendobjoriginal);
                        sendobj.url = sendobjoriginal.url

                        if (taskCardId == null) {
                            const newTaskCard = {
                                taskAssignedDate: new Date(),
                                taskAssignedId: taskAssignedid,
                            };

                            // axios.post('http://localhost:8080/service/master/task-card-save', newTaskCard)
                            submitSets(submitCollection.task_card_save, newTaskCard, true)
                                .then((savedTaskCardResponse) => {
                                    console.log('New Task card added', savedTaskCardResponse.extra);
                                    const newtaskCardId = savedTaskCardResponse.extra.id;

                                    setNewTaskCardId(newtaskCardId);

                                    const addWorkAssigned = {
                                        startDate,
                                        workerId,
                                        taskId,
                                        taskAssignedId: taskAssignedid,
                                        lotId,
                                        taskCardId: newtaskCardId,
                                        quantity,

                                    };

                                    // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                                    submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
                                        .then((response) => {
                                            console.log('Work assigned added successfully:', response.data);
                                            alertService.success('Worker added successfully');
                                            window.location.reload()
                                        })
                                        .catch((error) => {
                                            console.error('Error adding work assigned:', error);
                                        });

                                })
                                .catch((error) => {
                                    console.error('Error adding new task card:', error);
                                });
                        } else {
                            const addWorkAssigned = {
                                startDate,
                                workerId,
                                taskId,
                                taskAssignedId: taskAssignedid,
                                lotId,
                                taskCardId: taskCardId,
                                quantity,
                            };

                            // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                            submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
                                .then((response) => {
                                    console.log('Work assigned added successfully:', response);
                                    alertService.success('Worker added successfully');
                                    AddedWorkerList();
                                    window.location.reload()
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
        else {
            if (selectedWorkerValue) {
                console.log('selected worker: ', selectedWorkerValue);
                const name = selectedWorkerValue;
                setSelectedWorkersList((prevSelectedWorkers) => ({
                    ...prevSelectedWorkers,
                    [taskCardId]: [...(prevSelectedWorkers[taskCardId] || []), name],
                }));
                setSelectedWorker('');


                // axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${name}`)
                let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
                let sendobj = submitCollection.findWorkerIdByName;
                sendobj.url = (sendobj.url + '?name=' + name);

                submitSets(submitCollection.findWorkerIdByName, true)

                    .then((response) => {
                        const workerId = response.extra.workerId
                        console.log('Worker ID :', workerId);

                        console.log('New task card id: ', taskCardId)


                        console.log(sendobjoriginal);
                        sendobj.url = sendobjoriginal.url

                        // Check if taskCardId is null
                        if (taskCardId == null) {
                            // If null, it means it's a new card
                            const newTaskCard = {
                                taskAssignedDate: new Date(),
                                taskAssignedId: taskAssignedid
                            };

                            // axios.post('http://localhost:8080/service/master/task-card-save', newTaskCard)
                            submitSets(submitCollection.task_card_save, newTaskCard, true)
                                .then((savedTaskCardResponse) => {
                                    console.log('New Task card added', savedTaskCardResponse.extra);
                                    const newtaskCardId = savedTaskCardResponse.extra.id

                                    setNewTaskCardId(newtaskCardId);

                                    const addWorkAssigned = {
                                        startDate,
                                        workerId,
                                        taskId,
                                        taskAssignedId: taskAssignedid,
                                        lotId,
                                        taskCardId: newtaskCardId,
                                    }

                                    // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                                    submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
                                        .then((response) => {
                                            console.log('Work assigned added successfully:', response.data);
                                            alertService.success('Worker added successfully');
                                            window.location.reload()
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
                                taskCardId: taskCardId,
                            }

                            // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                            submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
                                .then((response) => {
                                    console.log('Work assigned added successfully:', response.data);
                                    alertService.success('Worker added successfully');
                                    AddedWorkerList();
                                    window.location.reload()
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

        // axios.get(`http://localhost:8080/service/master/find-by-type?expenseType=${selectedExpenseType}`)
        submitSets(submitCollection.find_by_type, '?expenseType=' + selectedExpenseType, true)
            .then((response) => {
                const expenseId = response.expenseId;
                setExpenseId(expenseId);

                const addTaskExpense = {
                    value,
                    taskId,
                    expenseId,
                    taskAssignedId: taskAssignedid,
                };

                //save task expense 
                // axios.post('http://localhost:8080/service/master/task-expense-save', addTaskExpense)
                submitSets(submitCollection.task_expense_save, addTaskExpense, true)
                    .then((response) => {
                        console.log('Task expense added successfully:', response.data);
                        alertService.success('Task-expense added successfully');

                        setValue('');
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

        // axios.post(`http://localhost:8080/service/master/findWorkerIdByName?name=${selectedWorker}`)
        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.findWorkerIdByName));
        let sendobj = submitCollection.findWorkerIdByName;
        sendobj.url = (sendobj.url + '?name=' + selectedWorker);

        submitSets(submitCollection.findWorkerIdByName, true)
            .then((response) => {
                const workerId = response.extra.workerId
                // setWorkerId(storeWorkerId);
                console.log('Worker ID :', workerId);

                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url

                const addWorkAssigned = {
                    quantity,
                    startDate,
                    workerId,
                    taskId,
                    taskAssignedId: taskAssignedid,
                    lotId,

                }

                // axios.post('http://localhost:8080/service/master/work-assigned-save', addWorkAssigned)
                submitSets(submitCollection.work_assigned_save, addWorkAssigned, true)
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

        // axios.post(`http://localhost:8080/service/master/updateEndDate/${taskAssignedid}`, details)

        let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.updateEndDate));
        let sendobj = submitCollection.updateEndDate;
        sendobj.url = (sendobj.url + '/' + taskAssignedid);

        submitSets(submitCollection.updateEndDate, details, true)
            .then((response) => {

                console.log(sendobjoriginal);
                sendobj.url = sendobjoriginal.url
                window.location.reload()
            })
            .catch((error) => {
                console.error(`Error updating endDate`, error);
            });
    }

    const formattedEndDate = getFormattedDate(commanTaskDetails.endDate);

    const handleRemoveWorker = (workAssignedId) => {

        axios.delete(`http://localhost:8080/service/master/work-assigned-delete/${workAssignedId}`)

        // let sendobjoriginal = JSON.parse(JSON.stringify(submitCollection.work_assigned_delete));
        // let sendobj = submitCollection.work_assigned_delete;
        // sendobj.url = (sendobj.url + '/' + workAssignedId);

        // submitSets(submitCollection.work_assigned_delete, true)
            .then(response => {
                console.log('Worker removed successfully:', response);

                // console.log(sendobjoriginal);
                // sendobj.url = sendobjoriginal.url

                AddedWorkerList();

            })
            .catch(error => {
                console.error('Error removing worker:', error);
            });
    };

    const goBack = () => {
        history.goBack();
    };

    console.log("taskDetails : ", taskDetails)

    const getTaskExpenses = (e) => {
        console.log('task ass id: ', taskAssignedid);
        // axios.get(`http://localhost:8080/service/master/findByTaskAssignedId?taskAssignedId=${taskAssignedid}`)
        submitSets(submitCollection.findByTaskAssignedId, '?taskAssignedId=' + taskAssignedid, true)
            .then((response) => {
                console.log('task expenses ------------ ', response.extra)
                setTaskExpenses(response.extra);
            })
            .catch((error) => {
                console.error('Error fetching task expenses:', error);
            });
    }

    const Delete = (workAssignedId) => {
        handleRemoveWorker(workAssignedId)
        handleClose()
    }

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

                                    <div className="container">
                                        {taskStatus === 'ongoing' ? (
                                            <div className="end-task-icon" onClick={EndTask}>
                                                <FontAwesomeIcon icon={faCheck} size="2x" />
                                            </div>
                                        ) : (
                                            <div></div>
                                        )}
                                    </div>

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
                                                                            {/* <Trash onClick={() => handleRemoveWorker(workerDetail.workAssigned)} /> */}

                                                                            <Trash onClick={() => handleShow(workerDetail.workerName, workerDetail.workAssigned)} />

                                                                        </div>

                                                                        <div>

                                                                            <Modal show={show} onHide={handleClose} animation={false}
                                                                                aria-labelledby="contained-modal-title-vcenter"
                                                                                centered>
                                                                                <Modal.Header>
                                                                                    <Modal.Title>Delete Worker !</Modal.Title>
                                                                                </Modal.Header>
                                                                                <Modal.Body>Are you sure you want to delete {deleteWorkerName} ?</Modal.Body>
                                                                                <Modal.Footer>
                                                                                    <Button variant="secondary"
                                                                                        onClick={handleClose}
                                                                                        style={{ border: 'none' }}>
                                                                                        Close
                                                                                    </Button>
                                                                                    <Button
                                                                                        variant="primary"
                                                                                        style={{ backgroundColor: 'red', border: 'none' }}
                                                                                        onClick={() => Delete(deleteWorkerId)}>
                                                                                        Delete
                                                                                    </Button>
                                                                                </Modal.Footer>
                                                                            </Modal>

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

                                                        {taskDetail.cardStatus !== 'completed' ? (
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
                                                        ) : (
                                                            <div></div>
                                                        )}

                                                        {taskStatus === 'ongoing' ? (
                                                            <>
                                                                {ongoingTaskName === 'Pluck' ? (
                                                                    <>
                                                                        {taskDetail.cardStatus !== 'completed' ? (
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

                                                                {taskDetail.cardStatus !== 'completed' ? (

                                                                    <button className='add-small' onClick={() => handleAddSelectedWorker(taskDetail.taskCardId)}>
                                                                        {t('add')}
                                                                    </button>
                                                                ) : (
                                                                    <div></div>
                                                                )}

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
                                        </div>

                                    ))}
                                </div>
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
                                        <button onClick={() => setShowExpenses(false)} className='close-task-expenses'>
                                            <MdClose />
                                        </button>
                                    ) : (
                                        <button onClick={() => setShowExpenses(true)} className='view-task-expenses'>
                                            View Task Expenses <MdViewAgenda />
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
                    </>

                )}
            </>

            <br />

            <br /><br /><br />

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

export default connect(mapStateToProps, mapDispatchToProps)(ManageOngoingTask);