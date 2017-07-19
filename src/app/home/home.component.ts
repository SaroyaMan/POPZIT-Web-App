import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {MusicService} from "../shared/music.service";
import {Song} from "../shared/song.model";
import * as $ from 'jquery';


@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

    mainPath = '/auth/signin';

    constructor(private authService:AuthService,
                private musicService:MusicService) { }

    ngOnInit() {
        let loader = $('#loaderContent');
        if(this.authService.isLoggedIn()) {
            loader.fadeIn(300);

            this.mainPath = '/category';
            this.musicService.initPlaylist()
                .subscribe( (songs:Song[]) => {
                    this.musicService.setPlaylist(songs);
                    if(this.authService.isAdmin() || this.musicService.getPlaylist().length !== 0) {
                        this.mainPath = '/dashboard/music';
                    }
                    loader.fadeOut(300);
                }, (err) => {
                    if(this.authService.isAdmin()) {
                        this.mainPath = '/dashboard/music';
                    }
                    loader.fadeOut(300);
                }

        );
        }
    }
}
