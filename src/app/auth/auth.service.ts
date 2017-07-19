import {User} from "./user.model";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import * as $ from 'jquery';

@Injectable()
export class AuthService {

    signedUser:User = null;
    loader = $("#loaderContent");

    constructor(private http:Http) {
        if(this.isLoggedIn()) {
            const user = JSON.parse(localStorage.getItem('user'));
            this.signedUser = new User(
                user.email,
                user.password,
                user.firstName,
                user.lastName,
                user.birthdate,
                user.gravatarHash,
                user.isAdmin
            );
        }
    }


    signup(user:User) {
        this.loader.fadeIn(300);
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://popzit-ws.herokuapp.com/user', body, {headers: headers})
            .map( (response:Response) => response.json())
            .catch( (error:Response) => Observable.throw(error.json()));
    }

    signin(user:User) {
        this.loader.fadeIn(300);
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('https://popzit-ws.herokuapp.com/user/signin', body, {headers: headers})
            .map( (response:Response) => {
                const jsonResponse = response.json();
                //Init the signedUser with the rest of fields.
                this.signedUser = user;
                this.signedUser.firstName = jsonResponse.user.firstName;
                this.signedUser.lastName = jsonResponse.user.lastName;
                this.signedUser.birthdate = jsonResponse.user.birthdate;
                this.signedUser.gravatarHash = jsonResponse.user.gravatarHash;
                this.signedUser.isAdmin = jsonResponse.user.isAdmin;
                return jsonResponse;
            })
            .catch( (error:Response) => Observable.throw(error));
    }

    signout() {
        localStorage.clear();
        this.signedUser = null;
    }


    //noinspection JSMethodCanBeStatic
    isLoggedIn() {
        return localStorage.getItem('token') !== null && localStorage.getItem('user') !== null;
    }

    isAdmin() {
        return this.isLoggedIn() && this.signedUser.isAdmin;
    }
}