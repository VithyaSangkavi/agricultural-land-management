import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from '../footer/footer';
import { useHistory } from "react-router-dom";
import DatePicker from 'react-datepicker';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';


function report() {
    return (
        <div>
            <h1>report</h1>

            <br /><br /><br />

            <div className='footer-alignment'>
                <Footer />
            </div>
        </div>
    )
}

export default report
