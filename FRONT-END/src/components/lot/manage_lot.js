import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import '../land/manage_lands.css';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';

const ManageLot = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLandId, setSelectedLandId] = useState('');
    const [landNames, setLandNames] = useState([]);
    const history = useHistory();

    useEffect(() => {
        axios.get('http://localhost:8080/service/master/lotFindAll').then((res) => {
            setData(res.data.extra);
        });
    }, []);

    useEffect(() => {
        submitSets(submitCollection.manageland, false).then((res) => {
            setLandNames(res.extra);
        });
    }, [data]);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleLandChange = (event) => {
        const newSelectedLandId = event.target.value;
        setSelectedLandId(newSelectedLandId);
    };

    console.log("selected land : ",selectedLandId);


    const filteredLots = data.filter((lot) => {
        return selectedLandId === '' || lot.id === selectedLandId;
    });

    return (
        <div className="manageLots">
            <div className="search">
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            <div className="filter">
                <label>Filter by Land:</label>
                <select value={selectedLandId} onChange={handleLandChange}>
                    <option value="">All Lands</option>
                    {landNames.map((land) => (
                        <option key={land.id} value={land.id}>
                            {land.name}
                        </option>
                    ))}
                </select>
            </div>

            {filteredLots.map((lot) => (
                <div key={lot.id} className="divWithBorder">
                    {lot.name}
                    <br />
                    {lot.area} {lot.areaUOM}
                </div>
            ))}
        </div>
    );
};

export default ManageLot;
