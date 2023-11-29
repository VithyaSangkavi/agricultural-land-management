import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useHistory, Link } from "react-router-dom";
import '../home/home.css';
import './report.css'
import Footer from '../footer/footer';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa';

function Report() {
    const [t, i18n] = useTranslation();

    const [lands, setLands] = useState([]);
    const [selectedLand, setSelectedLand] = useState('');

   useEffect(() => {
    axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
        setLands(response.data.extra);
        console.log("Lands : ", response.data.extra);
    });
   })

    const handleSelectedLand = (eventkey) => {
        setSelectedLand(eventkey);

        axios.post(`http://localhost:8080/service/master/findLandIdByName?name=${eventkey}`)
            .then((response) => {
                const landIdTask = response.data.extra;
                const taskLand = JSON.stringify(landIdTask);
                const landData = JSON.parse(taskLand);
                const landId = landData.landId;
                console.log('Selected Land Id :', landId);
                localStorage.setItem('SelectedLandId', landId);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
    };
  
    return (
        <div className="home-app-screen">
            <p className='main-heading'>Report</p>
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
                    </Dropdown.Menu>
                </Dropdown>
                <br />
            </div>
            <select className='report-dropdown'
            //   value={gender}
            //   className="input-field"
            >
              <option value="">Report Name</option>
              <option value="expense">Expenses</option>
              <option value="income">Income</option>
              <option value="income">Workers</option>
              <option value="Summary">Summary</option>
              <option value="Employee Perfomance">Employee Perfomance</option>
              <option value="Cost Breakdown">Cost Breakdown</option>
            </select>
            < br />
            <Footer />
        </div>
    );
}

export default Report;