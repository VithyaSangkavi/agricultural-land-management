import React from 'react';
import { noteInfoService } from '../../_services/noteinfo.service';

export default class NoteInfos extends React.Component{
    constructor(props) {
        super(props);
        
        this.state = {
            alerts: []
        };
    }

    componentDidMount() {
        this.subscription = noteInfoService.onNoteInfo().subscribe(alert => {
            if (!alert.message) {
                const alerts = this.state.alerts; //.filter(x => x.keepAfterRouteChange)
                this.setState({ alerts });
                return;
            }
            this.setState({ alerts: [alert] });

            // auto close alert if required
            if (alert.close) {
                this.removeNoteInfo();
            }
        });
    }

    componentWillUnmount(){
        this.subscription.unsubscribe();
    }

    removeNoteInfo() {
        this.setState({ alerts: [] })
    }

    render() {
        const { alerts } = this.state;
        if (!alerts.length) return null;

        return (
            <>
                {alerts.map((alert, index) =>
                    <div key={index} className={"noteinfo-alert"}>
                        <span dangerouslySetInnerHTML={{__html: alert.message}}></span>
                    </div>
                )}
            </>
        )
    }
}

