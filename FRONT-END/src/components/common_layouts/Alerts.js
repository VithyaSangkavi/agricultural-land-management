import React from 'react';
import { alertService, alertType } from '../../_services/alert.service';

export default class Alerts extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            alerts: []
        };
    }

    componentDidMount() {
        this.subscription = alertService.onAlert(this.props.id).subscribe(alert => {
            if (!alert.message) {
                const alerts = this.state.alerts; //.filter(x => x.keepAfterRouteChange)
                this.setState({ alerts });
                return;
            }
            this.setState({ alerts: [alert] });

            // auto close alert if required
            if (alert.autoClose) {
                setTimeout(() => this.removeAlert(alert), 2500);
            }
        });
    }

    componentWillUnmount(){
        this.subscription.unsubscribe();
    }

    removeAlert(alert) {
        if (this.props.fade) {
            // fade out alert
            const alertWithFade = { ...alert, fade: true };
            this.setState({ alerts: this.state.alerts.map(x => x === alert ? alertWithFade : x) });

            // remove alert after faded out
            setTimeout(() => {
                this.setState({ alerts: this.state.alerts.filter(x => x !== alertWithFade) })
            }, 250);
        } else {
            // remove alert
            this.setState({ alerts: this.state.alerts.filter(x => x !== alert) })
        }
    }

    cssClasses(alert) {
        if (!alert) return;

        const classes = ['alert', 'alert-dismissable'];
                
        const alertTypeClass = {
            [alertType.success]: 'alert alert-success',
            [alertType.error]: 'alert alert-danger',
            [alertType.info]: 'alert alert-info',
            [alertType.warning]: 'alert alert-warning'
        }

        classes.push(alertTypeClass[alert.type]);

        if (alert.fade) {
            classes.push('fade');
        }

        return classes.join(' ');
    }

    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;

        return (
            <>
                {alerts.map((alert, index) =>
                    <div key={index} className={this.cssClasses(alert)}>
                        <label className="close" onClick={() => this.removeAlert(alert)}>&times;</label>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </>
        )
    }
}

