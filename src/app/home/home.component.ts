import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {MusicService} from "../shared/music.service";
import {Song} from "../shared/song.model";
import {Subgenre} from "../shared/subgenre.model";

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
        if(this.authService.isLoggedIn()) {

            this.mainPath = '/category';
            this.musicService.initPlaylist()
                .subscribe( (songs:Song[]) => {
                    this.musicService.setPlaylist(songs);

                    // console.log(this.authService.isAdmin());
                    if(this.authService.isAdmin() || this.musicService.getPlaylist().length !== 0) {
                        this.mainPath = '/dashboard/music';
                    }
                    // else if(this.musicService.getPlaylist().length !== 0) {
                    //     this.mainPath = '/dashboard/music';
                    // }
                }, (err) => {
                    if(this.authService.isAdmin()) {
                        this.mainPath = '/dashboard/music';
                    }
                });
        }
        // this.mainPath = this.authService.isLoggedIn() ? '/category' : '/auth/signin';
    }
}
