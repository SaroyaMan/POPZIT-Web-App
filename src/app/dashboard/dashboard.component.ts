import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {AuthService} from "../auth/auth.service";
import {MusicService} from "../shared/music.service";
import {Router} from "@angular/router";
import {Song} from "../shared/song.model";
import {Subgenre} from "../shared/subgenre.model";

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {

    bodyClass = 'dashboardBackground';
    selectedSong:Song;

    constructor(public authService:AuthService,
                public musicService:MusicService) {}

    ngOnInit() {
        $('body').addClass(this.bodyClass);
        this.selectedSong = this.musicService.selectedSong;
        this.musicService.initPlaylist()
            .subscribe( (songs:Song[]) => {
                this.musicService.setPlaylist(songs);
                if(this.isAdmin() || this.musicService.getPlaylist().length !== 0) {
                    this.musicService.getSubgenres()
                        .subscribe( (categories:Subgenre[]) =>
                            this.musicService.initSelectedAlbums(categories) );
                }

            }, (err) => {
                if(this.isAdmin() ) {
                    this.musicService.getSubgenres()
                        .subscribe( (categories:Subgenre[]) =>
                            this.musicService.initSelectedAlbums(categories) );
                }
            });



    }

    ngOnDestroy() {
        $('body').removeClass(this.bodyClass);
        this.musicService.selectedAlbums = [];
        this.musicService.selectedSong = null;
        this.musicService.reset();
    }

    isAdmin() {return this.authService.isAdmin();}
}
