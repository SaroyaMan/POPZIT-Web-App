import {User} from "./user.model";
import {Injectable} from "@angular/core";
import {Http, Headers, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';

@Injectable()
export class AuthService {

    signedUser:User = null;


    constructor(private http:Http) {
        if(this.isLoggedIn()) {
            const user = JSON.parse(localStorage.getItem('user'));
            this.signedUser = new User(
                user.email,
                user.password,
                user.firstName,
                user.lastName,
                user.date,
                user.gravatarHash
            );
        }
    }


    signup(user:User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user', body, {headers: headers})
            .map( (response:Response) => response.json())
            .catch( (error:Response) => Observable.throw(error.json()));
    }

    signin(user:User) {
        const body = JSON.stringify(user);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/user/signin', body, {headers: headers})
            .map( (response:Response) => {
                const jsonResponse = response.json();

                //Init the signedUser with the rest of fields.
                this.signedUser = user;
                this.signedUser.firstName = jsonResponse.user.firstName;
                this.signedUser.lastName = jsonResponse.user.lastName;
                this.signedUser.date = jsonResponse.user.date;
                this.signedUser.gravatarHash = jsonResponse.user.gravatarHash;
                return jsonResponse;
            })
            .catch( (error:Response) => Observable.throw(error));
    }

    signout() {
        localStorage.clear();
        this.signedUser = null;
    }

    isLoggedIn() {
        return localStorage.getItem('token') !== null && localStorage.getItem('user') !== null;
    }
}