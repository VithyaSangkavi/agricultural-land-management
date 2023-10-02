import { Component } from 'react'
import { Button, Col, Container } from 'react-bootstrap';
import { withRouter } from 'react-router-dom';
import './ConfirmationPassword.css'
class ConfirmationPassword extends Component {
   
    componentDidMount(){
        document.body.classList.add("s-page");
    }

    componentWillUnmount(){
        document.body.classList.remove("s-page");
    }
    
    render() {
        return (<>
            <Col className="landing-overlay"></Col>
            <Col xs={12}>
                <Container>
                    <img src="assets/img/logo_o_inv.png" className="landing-logo" alt="planigo logo"/>
                    <Col className="signin-content">
                        <div className="confirmebox">
                        <div className="MailSent">Email Confirmation Details Sent</div>
                        <div className="checkmail">Check your email for confirmation message</div>
                            <Button variant="success" size="sm" className="confirmbtn" onClick={() => this.props.history.push('/signin')}>Continue</Button>
                        </div>    
                    </Col>
                    
                </Container>
            </Col>
        </>
            
        )
    }
}

export default withRouter(ConfirmationPassword);