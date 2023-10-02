import { Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

const alertSubject = new Subject();
const defaultId = 'default-alert';
const autoClose = true; 
const keepAfterRouteChange = false;
const msgOptions = { autoClose, keepAfterRouteChange };

export const alertService = {
    onAlert,
    success,
    error,
    info,
    warn,
    alert,
    clear,
};

export const alertType = {
    success: 'success',
    error: 'error',
    info: 'info',
    warning: 'warning'
}

function onAlert(id = defaultId) {
    return alertSubject.asObservable().pipe(filter(x => x && x.id === id));
}

function success(message) {
    alert({ ...msgOptions, type: alertType.success, message });
}

function error(message) {
    alert({ ...msgOptions, type: alertType.error, message });
}

function info(message) {
    alert({ ...msgOptions, type: alertType.info, message });
}

function warn(message) {
    alert({ ...msgOptions, type: alertType.warning, message });
}

function alert(alert) {
    alert.id = alert.id || defaultId;
    alertSubject.next(alert);
}

function clear(id = defaultId) {
    alertSubject.next({ id });
}