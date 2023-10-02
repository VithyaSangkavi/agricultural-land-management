import React from 'react';
import { withRouter } from 'react-router-dom';
import {Button, Col} from 'react-bootstrap';
import { ArrowLeftIcon } from '@primer/octicons-react';

import '../nomatch/nomatch.css';
import MSG403 from '../../assets/img/403_error.png';

const gobackstyle = {
    fontSize:"12px", padding: "10px 25px", background: "transparent", color: "#555", fontWeight: "600", textTransform: "uppercase"
}

class UnauthorizedComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
      
    componentDidMount(){
        
    }

    render(){
        return (<>
            
            <Col xs={12} md={6} className="nomatch-content centered text-center">
                <img src={MSG403} className="err-404" alt="404 message"/>
                <Col>
                    <Button variant="secondary" style={gobackstyle} onClick={() => this.props.history.goBack()}><ArrowLeftIcon/> Go Back</Button>
                </Col>
            </Col>
        </>);
    }
}

export default withRouter(UnauthorizedComponent);