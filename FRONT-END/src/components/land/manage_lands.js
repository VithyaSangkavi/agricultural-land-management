import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useHistory  } from 'react-router-dom';

import '../land/manage_lands.css';


const ManageLand = () => {
    const [data, setData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const history = useHistory();


    useEffect(() => {
        axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
            setData(response.data.extra);
            console.log("Lands : ", response.data.extra);

        });
    }, []);

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredData = data.filter((item) => {
        return item.name.toLowerCase().includes(searchQuery.toLowerCase());
    });

    const handleAddLotClick = () => {
        history.push('/insertLot');
    };


    return (
        <div className='manageLands'>
            <div className='search'>
                <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>

            {filteredData.map((item) => (
                <div key={item.id} className="divWithBorder">
                    {item.name}
                    <br />
                    {item.city}
                </div>
            ))}

        </div>
    );



};

export default ManageLand;
