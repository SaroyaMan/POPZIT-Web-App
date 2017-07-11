import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../shared/music.service";
import {Song} from "../../shared/song.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";

@Component({
    selector: 'app-music-manage',
    templateUrl: './music-manage.component.html',
    styleUrls: ['./music-manage.component.css']
})
export class MusicManageComponent implements OnInit {

    form:FormGroup;
    playlist:Song[];

    searchedSong;

    errMsg = '';
    isAdmin = false;

    constructor(public musicService:MusicService,
                private authService:AuthService) {}

    ngOnInit() {
        this.form = new FormGroup({
            artist: new FormControl(null, Validators.required),
            track: new FormControl(null, Validators.required),
        });
        this.playlist = this.musicService.getPlaylist();
        this.isAdmin = this.authService.isAdmin();
    }

    playSongByIndex(index:number) {
        this.musicService.playSongByIndex(index);
    }

    onSubmit() {
        this. searchedSong = this.musicService.searchSong(
            this.form.value.artist, this.form.value.track)
            .subscribe( (song:Song) => {
                    console.log(song);
                    if(song === null) {
                        this.errMsg = 'No Results Was Found';
                        this.searchedSong = null;
                    }
                    else {
                        this.searchedSong = song;
                        this.errMsg = '';
                    }
                }, (err) => {
                    this.errMsg = 'No Results Was Found';
                    this.searchedSong = null;
                }
            );
        this.form.reset();
    }

    playSong(song:Song) {
        this.musicService.initSong(song, true);
    }

    addToPlaylist(song:Song) {
        this.musicService.addSongToPlaylist(song);
    }

    removeSongFromPlaylist(index:number) {
        this.musicService.removeSongFromPlaylist(index);
    }

    savePlaylist() {
        this.musicService.savePlaylist().subscribe(
            (response) => {
                console.log('Playlist saved succesfully!');
                console.log(response);
            },
            (err) => {
                console.log('Failed to save playlist!');
                console.log(err);
            });
    }

    publishPlaylist() {
        this.musicService.publishPlaylist().subscribe(
            (response) => {
                console.log('Playlist published succesfully!');
                console.log(response);
            },
            (err) => {
                console.log('Failed to save playlist!');
                console.log(err);
            });
    }

}