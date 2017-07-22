import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {MusicService} from "../../shared/music.service";
import {Playlist} from "../../shared/playlist.model";
import {Song} from "../../shared/song.model";
import {Router} from "@angular/router";
import {AlertService} from "../../shared/alert-box/alert.service";
import {Alert} from "../../shared/alert-box/alert.model";
import * as $ from 'jquery';

@Component({
    selector: 'app-playlists',
    templateUrl: './playlists.component.html',
    styleUrls: ['./playlists.component.css']
})
export class PlaylistsComponent implements OnInit {

    playlists:Playlist[];

    selectedPlaylist:Playlist;
    songs:Song[] =[];
    userId;

    constructor(public authService:AuthService,
                private musicService:MusicService,
                private router:Router,
                private alertService:AlertService) { }

    ngOnInit() {
        $("#loaderContent").fadeIn(300);
        this.musicService.getPublicPlaylists()
            .subscribe( (playlists:Playlist[]) => {
                this.playlists = playlists;
                $("#loaderContent").fadeOut(300);
            });
        this.userId = localStorage.getItem('userId');
    }

    loadPlaylist(playlist:Playlist) {
        this.songs = playlist.songs;
        this.selectedPlaylist = playlist;
    }

    assignPlaylist(playlist:Playlist) {
        this.musicService.setPlaylist(playlist.songs);
        this.router.navigate(['/dashboard/music']);
    }

    deletePlaylist(playlist:Playlist, index:number) {
        let loader = $("#loaderContent");
        loader.fadeIn(300);
        this.musicService.deletePlaylist(playlist)
            .subscribe(
                (res) => {
                    this.playlists.splice(index);
                    this.alertService.handleAlert(new Alert('Playlist succesfully deleted', 'playlist deleted!'))
                    loader.fadeOut(300);
                },
                (err) => {
                    this.alertService.handleAlert(new Alert('Failed to delete playlist',
                        'Your playlist could not be deleted due to internal error of the server!',
                        '#F64222'));
                    loader.fadeOut(300);
                });
    }

    editPlaylist(playlist:Playlist, index:number) {
        this.musicService.setPlaylist(playlist.songs);
        this.router.navigate([`/dashboard/music/${playlist.id}/edit`]);
    }

    playSong(song:Song) {
        this.musicService.initSong(song, true);
    }

    addToPlaylist(song:Song) {
        this.musicService.addSongToPlaylist(song);
    }
}
