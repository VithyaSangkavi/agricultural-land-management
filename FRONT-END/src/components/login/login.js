import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../login/login.css';
import { useHistory } from 'react-router-dom';
import { alertService } from '../../_services/alert.service';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { Col, Row } from 'react-bootstrap';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import i18n from "i18next";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { languageAction } from '../../actions/auth/login_action';


function Login(props) {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                username,
                password,
            };

            submitSets(submitCollection.login, dataToSend, false).then(res => {

                console.log("response : ", res)

                if (res && res.status) {

                    alertService.success('Login Successful');

                    props.handleSignObj(res);

                    history.push('/home');
                }
                else {

                    alertService.error('Login Failed');
                }

            });

        } catch (error) {
            console.error('An error occurred during login:', error);
            alertService.error('An error occurred during login. Please try again later.');
        }
    };

    const handleLanguageChange = (lang) => {
        i18n.changeLanguage(lang);
        props.setLangObj({ languageDetails: { code: lang } });
    };





    return (
        <div className="parent-container position-relative">
            <div className="position-absolute top-0 end-0 mt-2 me-2">
                <DropdownButton
                    id="dropdown-language"
                    title={<FaLanguage />}
                    onSelect={handleLanguageChange}
                    variant="secondary"
                >
                    <Dropdown.Item eventKey="en">
                        <FaGlobeAmericas /> English
                    </Dropdown.Item>
                    <Dropdown.Item eventKey="sl">
                        <FaGlobeAmericas /> Sinhala
                    </Dropdown.Item>
                </DropdownButton>
            </div>

            <div className="login-container mx-auto mt-5">
                <h2 className="text-center mb-4">{props.t('loginname')}</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail" className="mb-3">
                        <Form.Label>{props.t('email')}</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder={props.t('enteremail')}
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Label>{props.t('password')}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={props.t('enterpassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button variant="primary" type="submit">
                            {props.t('submit')}
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );


}

const mapStateToProps = state => ({
    langState: state.languageReducer
});

const mapDispatchToProps = dispatch => ({
    setLangObj: (payload) => dispatch(languageAction(payload))
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Login));



