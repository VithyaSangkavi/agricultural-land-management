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
    


    return (
        <div className="centered-container">
            asdasdasdasdasd
{console.log(props.signedobj)}
{console.log("Print this message")}

            <button onClick={ManageLot}>
                Manage Lot
            </button>

            <button onClick={AddLand}>
                Add Land
            </button>

            <button onClick={ManageLand}>
                Manage Land
            </button>
            
        </div>
    );
};

export default MenuButton;
