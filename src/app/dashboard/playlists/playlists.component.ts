import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {MusicService} from "../../shared/music.service";
import {Playlist} from "../../shared/playlist.model";
import {Song} from "../../shared/song.model";
import {Router} from "@angular/router";

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
                private router:Router) { }

    ngOnInit() {
        this.musicService.getPublicPlaylists()
            .subscribe( (playlists:Playlist[]) => {
                this.playlists = playlists;
            });
        this.userId = localStorage.getItem('userId');
    }

    loadPlaylist(playlist:Playlist) {
        this.songs = playlist.songs;
        this.selectedPlaylist = playlist;
        console.log(this.selectedPlaylist);
    }

    assignPlaylist(playlist:Playlist) {
        this.musicService.setPlaylist(playlist.songs);
        this.router.navigate(['/dashboard/music']);
    }

    deletePlaylist(playlist:Playlist, index:number) {
        this.musicService.deletePlaylist(playlist)
            .subscribe( (res) => {
                this.playlists.splice(index);
            });
    }

    playSong(song:Song) {
        this.musicService.initSong(song, true);
    }

    addToPlaylist(song:Song) {
        this.musicService.addSongToPlaylist(song);
    }
}
