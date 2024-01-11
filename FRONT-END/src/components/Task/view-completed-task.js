import { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory } from "react-router-dom";
import './completed-task.css';
import Footer from '../footer/footer';
import Header from '../header/header';
import { FaMapMarker } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import { submitSets } from '../UiComponents/SubmitSets';
import { submitCollection } from '../../_services/submit.service';
import { connect } from 'react-redux';
import { setSelectedLandIdAction } from '../../actions/auth/land_action';
import { alertService } from '../../_services/alert.service';

function Home({ setSelectedLandId, selectedLandId }) {
    const [t, i18n] = useTranslation();


    const [landNames, setLandNames] = useState([]);
    const [landName, setLandName] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');

    const [query, setQuery] = useState('');
    const [task, setTask] = useState([]);
    const [taskAssigned, setTaskAssigned] = useState([]);
    const [OngoingTasks, setOngoingTasks] = useState([]);

    const history = useHistory();

    const getFormattedDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();

        const formattedDate = `${day}/${month}/${year}`;

        return formattedDate;
    };

    const handleLandChange = (event) => {
        console.log("Land : ", event);
        setSelectedLandId(event);
    };

    useEffect(() => {
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
        let apiUrl = 'http://localhost:8080/service/master/completed-tasks-with-names';

        if (selectedLandId) {
            apiUrl += `?landId=${selectedLandId}`;
        }

        axios.get(apiUrl)
            .then((response) => {
                if (Array.isArray(response.data.extra)) {
                    setOngoingTasks(response.data.extra);
                    console.log("Ongoing tasks: ", response.data.extra);
                } else {
                    setOngoingTasks([]);
                }
            })
            .catch((error) => {
                console.error('Error fetching tasks:', error);
                setOngoingTasks([]);
            });

        submitSets(submitCollection.completed_tasks_with_names, "?landId=" + selectedLandId, true)
            .then((response) => {

                if (response.extra.length === 0) {
                    alertService.info('No Data Found !');
                }

                setOngoingTasks(response.extra);
                console.log("Ongoing tasks : ", response.extra);

            });

    }, [selectedLandId]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };
    const filteredTasks = task.filter((task) =>
        task.taskName.toLowerCase().includes(searchQuery.toLowerCase())
    );


    const handleChange = (event) => {
        setQuery(event.target.value);
    };
    const filteredTaskAssigned = Array.isArray(taskAssigned)
        ? taskAssigned.filter((task) => task.taskAssignedId)
        : [];

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };

    const handleTaskClick = (taskAssignedid) => {
        history.push(`/completedTask/${taskAssignedid}`);
        console.log("task assigned : ", taskAssignedid);
    };

    const goBack = () => {
        history.goBack();
    };

    return (
        <div className="home-app-screen">
            <Header />
            <br />

            <div className="drop-down-container" style={{ marginTop: "-25px" }}>
                <div className='landsectioncover'>
                    <p className="landsection">
                        <FaMapMarker style={{ marginRight: '5px' }} />
                        Selected Land: {landName}
                    </p>
                </div>

                <p className="home-heading">{t('completedtasks')}</p>
            </div>

            <div className="task-list">
                {OngoingTasks.map((taskAssigned) => (
                    <div key={taskAssigned.id} className="task-card" onClick={() => handleTaskClick(taskAssigned.taskAssignedId)}>
                        <p>{taskAssigned.taskName} - {getFormattedDate(taskAssigned.taskStartDate)} - land {taskAssigned.landId}</p>
                    </div>
                ))}
            </div>

            <br />
            <br />
            <br />

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

export default connect(mapStateToProps, mapDispatchToProps)(Home);