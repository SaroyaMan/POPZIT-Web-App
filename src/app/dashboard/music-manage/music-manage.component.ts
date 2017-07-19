import { Component, OnInit } from '@angular/core';
import {MusicService} from "../../shared/music.service";
import {Song} from "../../shared/song.model";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../auth/auth.service";
import {Params, ActivatedRoute} from "@angular/router";
import {AlertService} from "../../shared/alert-box/alert.service";
import {Alert} from "../../shared/alert-box/alert.model";
import * as $ from 'jquery';

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

    editMode = false;
    playlistId = '';

    loader = $('#loaderContent');

    constructor(public musicService:MusicService,
                private authService:AuthService,
                private route:ActivatedRoute,
                private alertService:AlertService) {}

    ngOnInit() {

        this.form = new FormGroup({
            artist: new FormControl(null, Validators.required),
            track: new FormControl(null, Validators.required),
        });
        this.playlist = this.musicService.getPlaylist();
        this.isAdmin = this.authService.isAdmin();

        this.route.params
            .subscribe(
                (params:Params) => {
                    this.playlistId = params['playlistId'];
                    this.editMode = params['playlistId'] != null;
                }
            );
    }

    playSongByIndex(index:number) {
        this.musicService.playSongByIndex(index);
    }

    onSubmit() {            ///On Search
        this.loader.fadeIn(300);
        this.searchedSong = this.musicService.searchSong(
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
                    this.loader.fadeOut(300)
                }, (err) => {
                    this.errMsg = 'No Results Was Found';
                    this.searchedSong = null;
                    this.loader.fadeOut(300)
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
        // this.playlist.splice(index, 1);
        this.musicService.removeSongFromPlaylist(index);
    }

    savePlaylist() {
        this.loader.fadeIn(300);
        this.musicService.savePlaylist().subscribe(
            (response) => {
                console.log('Playlist saved succesfully!');
                this.alertService.handleAlert(new Alert('Playlist succesfully saved', 'Your playlist saved!'))
                this.loader.fadeOut(300);
            },
            (err) => {
                console.log('Failed to save playlist!');
                this.alertService.handleAlert(new Alert('Failed to save playlist',
                    'Your playlist could not be saved due to internal error of the server!',
                    '#F64222'));
                this.loader.fadeOut(300);
            });
    }

    publishPlaylist() {
        this.loader.fadeIn(300);
        this.musicService.publishPlaylist().subscribe(
            (response) => {
                console.log('Playlist published succesfully!');
                this.alertService.handleAlert(new Alert('Playlist succesfully published',
                    `Your playlist published! You will see it soon under 'Playlists'`));
                this.loader.fadeOut(300)
            },
            (err) => {
                console.log('Failed to publish playlist!');
                this.alertService.handleAlert(new Alert('Failed to publish playlist',
                    'Your playlist could not be published due to internal error of the server!',
                    '#F64222'));
                this.loader.fadeOut(300)
            });
    }

    editPlaylist() {
        this.loader.fadeIn(300);
        this.musicService.editPlaylist(this.playlistId).subscribe(
            (response) => {
                console.log('Playlist edited succesfully!');
                this.alertService.handleAlert(new Alert('Playlist succesfully edited',
                    `Your playlist edited! You will see your changes soon under 'Playlists'`));
                this.loader.fadeOut(300)

            },
            (err) => {
                console.log('Failed to edit playlist!');
                this.alertService.handleAlert(new Alert('Failed to edit playlist',
                    'Your playlist could not be edited due to internal error of the server!',
                    '#F64222'));
                this.loader.fadeOut(300)
            });
    }

}