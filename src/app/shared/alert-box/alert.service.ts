import {EventEmitter} from "@angular/core";
import {Alert} from "./alert.model";


export class AlertService {

    alertOccured = new EventEmitter<Alert>();

    handleAlert(alert:Alert) {
        this.alertOccured.emit(alert);
    }
}