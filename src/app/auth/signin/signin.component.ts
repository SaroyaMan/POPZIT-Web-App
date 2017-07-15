import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {User} from "../user.model";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AlertService} from "../../shared/alert-box/alert.service";
import {Alert} from "../../shared/alert-box/alert.model";

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css'],
})
export class SigninComponent implements OnInit, OnDestroy {

    bodyClasses = "loginBackground";
    form:FormGroup;

    loader = $("#loaderContent");

    constructor(private authService:AuthService,
                private router:Router,
                private alertService:AlertService) { }

    ngOnInit() {
        $('body').addClass(this.bodyClasses);
        this.form = new FormGroup({
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null, Validators.required),
        });
    }

    onSubmit() {
        const user = new User(this.form.value.email, this.form.value.password);
        this.authService.signin(user)
            .subscribe(
                (data) => {
                    this.loader.fadeOut(300);
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    localStorage.setItem('userId', data.userId);

                    this.router.navigateByUrl('/');
                },
                (error) => {
                    this.loader.fadeOut(300);
                    console.log(error);
                    this.alertService.handleAlert(new Alert('Error', `email or password is wrong, please try again`, '#F64222'))

                }
            );
        this.form.reset();
    }

    ngOnDestroy() {
        $('body').removeClass(this.bodyClasses);
    }
}
