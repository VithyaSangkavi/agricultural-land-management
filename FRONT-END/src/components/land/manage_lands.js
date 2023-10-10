import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageLand = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8080/service/master/landFindAll').then((response) => {
            setData(response.data.extra);
            console.log("Lands : ", data);

        });
    }, []);

    return (
        <div>

            <div>
                {data.map((item) => (
                    <li key={item.id}>
                        {item.name}
                        <br/>
                        {item.city}
                    </li>
                ))}
            </div>

        </div>
    );
};

export default ManageLand;
