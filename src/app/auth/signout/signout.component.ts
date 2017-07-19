import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth.service";
import {Router} from "@angular/router";
import {MusicService} from "../../shared/music.service";

@Component({
    selector: 'app-signout',
    templateUrl: './signout.component.html',
    styleUrls: ['./signout.component.css']
})
export class SignoutComponent implements OnInit {

    constructor(private authService:AuthService,
                private router:Router,
                private musicService:MusicService) {}

    ngOnInit() {        //We call directly to logout...
        this.onLogout();
    }


    onLogout() {
        this.authService.signout();
        this.musicService.reset();
        this.router.navigate(['/']);
    }
}