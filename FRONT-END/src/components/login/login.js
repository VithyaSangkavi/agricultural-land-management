import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import '../login/login.css';
import { useHistory } from 'react-router-dom';
import { alertService } from '../../_services/alert.service';
import { submitCollection } from '../../_services/submit.service';
import { submitSets } from '../UiComponents/SubmitSets';

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


    return (
        <div className="parent-container">
            <div className="login-container">
                <h2>Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Enter email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>
                </Form>
            </div>
        </div>
    );
}

export default Login;


