import React, { useState } from 'react';
import Axios from 'axios';
import '../land/insert_land.css';

const InsertLand = () => {
    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');
    const [city, setCity] = useState('');

    const handleSubmit = () => {
    const dataToSend = {
        name,
        area,
        areaUom,
        city,
    };

    Axios.post('http://localhost:8080/service/master/landSave', dataToSend)
        .then((response) => {
            console.log('Data sent successfully:', response.data);
        })
        .catch((error) => {
            console.error('Error sending data:', error);
        });
    };

    return (
        <div className="centered-container">

            <input
                className="input-field"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                className="input-field"
                placeholder="Area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
            />

            <select
                className="input-field"
                value={areaUom}
                onChange={(e) => setAreaUom(e.target.value)}
            >
                <option value="">Select Area UOM</option>
                <option value="arce">Arce</option>
                <option value="perch">Perch</option>
            </select>

            <select
                className="input-field"
                value={city}
                onChange={(e) => setCity(e.target.value)}
            >
                <option value="">Select City</option>
                <option value="kandy">Kandy</option>
                <option value="colombo">Colombo</option>
                <option value="jaffna">Jaffna</option>
                <option value="gampaha">Gampaha</option>
            </select>

            <button className="submit-button" onClick={handleSubmit}>
                ADD
            </button>
        </div>
    );
};

export default InsertLand;
