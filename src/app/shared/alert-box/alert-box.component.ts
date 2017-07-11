import { Component, OnInit } from '@angular/core';
import * as $ from 'jquery';
import {Alert} from './alert.model';
import {AlertService} from "./alert.service";


@Component({
    selector: 'app-error',
    templateUrl: './alert-box.component.html',
    styleUrls: ['./alert-box.css']
})


// //When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//     if (event.target == modal) {
//         modal.style.display = "none";
//     }
// }


export class ErrorComponent implements OnInit {

    // modal = $('#myModal');

    alert:Alert;
    displayed = 'none';
    // displayed = 'block';

    onErrorHandled() {
        this.displayed = 'none';
    }

    constructor(private alertBoxService:AlertService) { }

    ngOnInit() {
        this.alertBoxService.alertOccured
            .subscribe(
                (alert:Alert) => {
                    this.alert = alert;
                    this.displayed = 'block';
                }
            );
        this.alert = new Alert('some header', 'some body');
    }
}