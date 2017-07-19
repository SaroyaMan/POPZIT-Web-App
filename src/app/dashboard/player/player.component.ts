import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Song} from "../../shared/song.model";
import {Album} from "../../shared/album.model";
import * as $ from 'jquery';
import {MusicService} from "../../shared/music.service";


@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnChanges, OnDestroy {

    @Input() song:Song;

    private player:YT.Player;
    private ytEvent;

    private playPath = '../../../assets/images/play_music_bar.png';
    private pausePath = '../../../assets/images/pause_music_bar.png';
    private soundOnPath = '../../../assets/images/sound_on_music_bar.png';
    private soundOffPath = '../../../assets/images/sound_off_music_bar.png';

    private currTime = 0;
    private songDurationInterval;

    constructor(private musicService:MusicService) {}


    ngOnInit() {
        // this.startInterval();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if(this.player) {
            this.player.loadVideoById(this.song.youtubeId);
            $('#toggleVideo').css('background-image', `url(${this.pausePath})` );
            this.isPlayed = true;
        }
        clearInterval(this.songDurationInterval);
        this.currTime = 0;
        this.startInterval();
        $('progress').val(0);
    }

    ngOnDestroy() {
        clearInterval(this.songDurationInterval);
    }

    startInterval() {
        let progress = $('progress');
        this.songDurationInterval = setInterval(
            () => {
                if (this.player.getCurrentTime() <= this.player.getDuration()) {
                    this.currTime = this.player.getCurrentTime();
                    progress.val(Math.floor(Math.round((this.currTime / this.player.getDuration())*100)));
                }
                if(this.player.getCurrentTime() === this.player.getDuration()) {
                    clearInterval(this.songDurationInterval);
                    if(this.musicService.getPlaylist().length !== 0) {
                        this.nextSong();

                    }
                }
            }, 700);
    }


    addToPlaylist() {
        this.musicService.addSongToPlaylist(this.song);
    }

    onStateChange(event) {
        event.id = this.song.youtubeId;
        this.ytEvent = event.data;

    }

    savePlayer(player) {
        this.player = player;
        this.startInterval();
        this.playVideo();
    }

    isPlayed:boolean;
    playVideo() {
        this.player.playVideo();
        this.isPlayed = true;
    }

    pauseVideo() {
        this.player.pauseVideo();
        this.isPlayed = false;
    }


    toggleVideo() {
        if(this.isPlayed) {
            this.pauseVideo();
            $('#toggleVideo').css('background-image', `url(${this.playPath})` );
        }
        else {
            this.playVideo();
            $('#toggleVideo').css('background-image', `url(${this.pausePath})` );
        }
    }

    toggleSound() {
        if(this.player.isMuted()) {
            this.player.unMute();
            $('#toggleSound').css('background-image', `url(${this.soundOnPath})` );
        }
        else {
            this.player.mute();
            $('#toggleSound').css('background-image', `url(${this.soundOffPath})` );

        }
    }

    jumpTo(event) {
        let progress = $('progress');
        let x = event.pageX - progress.offset().left;
        let clickedValue = x * 100 / progress.outerWidth();
        progress.val(Math.round(Math.floor(clickedValue)));

        let jumping = this.player.getDuration() * (clickedValue/100);
        this.player.seekTo(jumping,true);
    }

    prevSong() {
        if(this.musicService.isPlaylistEmpty()) return;
        this.musicService.getPrevSong();
        this.ngOnChanges(null);
    }

    nextSong() {
        if(this.musicService.isPlaylistEmpty()) return;
        this.musicService.getNextSong();
        this.ngOnChanges(null);
    }
}