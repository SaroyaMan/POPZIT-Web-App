import {Component, OnInit} from '@angular/core';
import {Album} from "../../shared/album.model";
import {Song} from "../../shared/song.model";
import {AuthService} from "../../auth/auth.service";
import {MusicService} from "../../shared/music.service";
import * as $ from 'jquery';

@Component({
    selector: 'app-radio',
    templateUrl: './radio.component.html',
    styleUrls: ['./radio.component.css']
})
export class RadioComponent implements OnInit {

    albums:Album[] = [];
    songs:Song[] = [];

    selectedAlbum:Album;

    constructor(public authService:AuthService,
                private musicService:MusicService) {}

    ngOnInit() {
        this.albums = this.musicService.selectedAlbums;
    }

    loadAlbum(album:Album) {
        this.songs = [];
        let i = 0;
        for(let song of album.songs) {
            this.songs[i++] = new Song(song.name, (<any>(song.artist)).name);
        }
        for(let song of this.songs) song.album = album;
        this.selectedAlbum = album;
    }

    playSong(song:Song) {
        this.musicService.initSong(song, true);
    }

    addToPlaylist(song:Song) {
        this.musicService.addSongToPlaylist(song);
    }
}
