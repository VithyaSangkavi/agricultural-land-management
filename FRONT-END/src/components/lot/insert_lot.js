import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import '../lot/insert_lot.css';
import { submitCollection } from '../../_services/submit.service';

const InsertLot = () => {

    const [name, setName] = useState('');
    const [area, setArea] = useState('');
    const [areaUom, setAreaUom] = useState('');
    const [landId, setLandId] = useState('');

    const handleSubmit = () => {
    const dataToSend = {
        name,
        area,
        areaUom,
        landId,
    };

    axios.post('http://localhost:8080/service/master/lotSave', dataToSend)
        .then((response) => {
            console.log('Data sent successfully:', response.data);
            console.log(submitCollection.savelot)
        })
        .catch((error) => {
            console.error('Error sending data:', error);
        });
    };

    return (
        <div className="centered-container">

            <input
                className="input-field"
                placeholder="Lot Name"
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
                <option value="">   Area - UOM   </option>
                <option value="arce">Arce</option>
                <option value="perch">Perch</option>
            </select>

            <button className="submit-button" onClick={handleSubmit}>
                ADD
            </button>
        </div>
    );
};

export default InsertLot;
