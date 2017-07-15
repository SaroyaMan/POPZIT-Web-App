import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Month} from "./month.enum";
import {Observable} from "rxjs/Observable";
import {User} from "../user.model";
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {AlertService} from "../../shared/alert-box/alert.service";
import {Alert} from "../../shared/alert-box/alert.model";

@Component({
    selector: 'app-signup',
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

    bodyClasses = "loginBackground";
    form:FormGroup;
    pass:string = '';

    years:number[] = [];
    days:number[] = [];
    months;
    Month = Month;

    loader = $("#loaderContent");


    constructor(private authService:AuthService,
                private router:Router,
                private alertService:AlertService) {
        let nowYear = new Date().getFullYear();
        for(let i = 1948; i <= nowYear; i++) {
            this.years.push(i);
        }

        for(let i = 1; i < 29; i++) {
            this.days.push(i);
        }
        this.months = Object.keys(Month).filter(Number)
    }

    ngOnInit() {
        $('body').addClass(this.bodyClasses);

        this.form = new FormGroup({
            firstName: new FormControl(null, Validators.required),
            lastName: new FormControl(null, Validators.required),
            email: new FormControl(null, [Validators.required, Validators.email]),
            password: new FormControl(null,
                [Validators.required, Validators.minLength(6), Validators.maxLength(12)]),
            passwordConfirm: new FormControl(null,
                [Validators.required, Validators.minLength(6), Validators.maxLength(12)],
                [this.passwordValidate.bind(this)]),
            year: new FormControl('1991', Validators.required),
            month: new FormControl(Month['January'], Validators.required),
            day: new FormControl(1, Validators.required)
        });
    }

    onSubmit() {
        let birthdate = new Date(this.form.value.year,
                                 this.form.value.month-1,
                                 this.form.value.day);
        const user = new User(
            this.form.value.email,
            this.form.value.password,
            this.form.value.firstName,
            this.form.value.lastName,
            birthdate,
        );

        this.authService.signup(user).subscribe(
            (data) => {
                console.log(data);
                this.alertService.handleAlert(new Alert('User Succesfully Created', `${user.firstName} ${user.lastName} has been created! You are welcome to login, and start POP it!`,))
                this.form.reset();
                this.router.navigate(['/']);
            },
            (error) => {
                console.log(error);
                this.alertService.handleAlert(new Alert('Error', `${user.firstName} ${user.lastName} could not be created, mail is probably exists`, '#F64222'))
            },
            () => this.loader.fadeOut(300)
        );

    }

    passwordValidate(control:FormControl):Promise<any> | Observable<any> {
        return new Promise<any>(
            (resolve,eject) => {
                setTimeout(
                    () => {
                        if(control.value !== this.pass)
                            resolve({'passwordNotMatch': true});
                        else resolve(null);
                    },500);
            }
        );
    }

    ngOnDestroy() {
        $('body').removeClass(this.bodyClasses);
    }
}