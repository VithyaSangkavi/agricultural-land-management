import { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../login/login.css';
import { useHistory } from 'react-router-dom';
import { alertService } from '../../_services/alert.service';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';
import { FaGlobeAmericas, FaLanguage } from 'react-icons/fa';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import i18n from "i18next";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { languageAction } from '../../actions/auth/login_action';
import { loginAction } from '../../actions/auth/login_action';
import { useDispatch } from 'react-redux';


function Login(props) {
    const history = useHistory();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

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

                    // props.handleSignObj(res);
                    dispatch(loginAction(res));  // Dispatch the login action with the response data

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
        <div className="parent-container">
            <p className='main-heading'>Agri-Management</p>
            <div className="position-absolute top-0 end-0 mt-2 me-2">
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
                            className="input-field"
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword" className="mb-3">
                        <Form.Label>{props.t('password')}</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder={props.t('enterpassword')}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field"
                        />
                    </Form.Group>

                    <div className="text-center">
                        <Button variant="primary" type="submit" className="login-button">
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
    setLangObj: (payload) => dispatch(languageAction(payload)),
    setSigninObj: (payload) => dispatch(loginAction(payload))
});

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Login));



