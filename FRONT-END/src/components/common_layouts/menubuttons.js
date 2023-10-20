import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

const MenuButton = (props) => {
    const history = useHistory();

    const AddLot = () => {
        history.push('/insertlot');
    };
    const ManageLot = () => {
        history.push('/managelots');
    };
    const AddLand = () => {
        history.push('/insertland');
    };
    const ManageLand = () => {
        history.push('/managelands');
    };
    const logout = () => {
        history.push('/');
    };



    return (
        <div className="centered-container">

            <button onClick={ManageLot}>
                Manage Lot
            </button>

            <button onClick={AddLand}>
                Add Land
            </button>

            <button onClick={ManageLand}>
                Manage Land
            </button>

            <button onClick={logout}>
                Logout
            </button>
            
        </div>
    );
};

export default MenuButton;
