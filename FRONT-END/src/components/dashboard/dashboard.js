import React from 'react';
import { withRouter } from 'react-router-dom';
import { Col } from 'react-bootstrap';

import './dashboard.css';

class DashboardComponent extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            
        }
    }
      
    componentDidMount(){
        
    }

    handleFilterObject = () => {

    }

    render(){
        return (<>
            <Col xs={12} className="main-content">
                <Col xs={12} className="dashboard-content">
                    Dashboard
                </Col>    
            </Col>
            
        </>);
    }
}

export default withRouter(DashboardComponent);