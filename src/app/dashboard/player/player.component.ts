import {Component, Input, OnChanges, OnDestroy, SimpleChanges} from '@angular/core';
import {Song} from "../../shared/song.model";
import * as $ from 'jquery';
import {MusicService} from "../../shared/music.service";


@Component({
    selector: 'app-player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnChanges, OnDestroy {

    @Input() song:Song;
    player:YT.Player;
    currTime = 0;
    isPlayed:boolean;
    isMuted:boolean;

    private ytEvent;
    private songDurationInterval;

    constructor(private musicService:MusicService) {}


    ngOnChanges(changes: SimpleChanges): void {
        if(this.player) {
            this.player.loadVideoById(this.song.youtubeId);
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
                if(this.player) {
                    if (this.player.getCurrentTime() <= this.player.getDuration()) {
                        this.currTime = this.player.getCurrentTime();
                        progress.val(Math.floor(Math.round(
                            (this.currTime / (this.player.getDuration() === 0 ? 1 : this.player.getDuration()
                            ))*100)));
                    }
                    if(this.player.getCurrentTime() === this.player.getDuration() && this.player.getDuration() !== 0) {
                        if(!this.musicService.isPlaylistEmpty()) {
                            this.nextSong();
                        }
                        /*Happens once, don't worry. clearInterval is not possible
                          inside setInterval (in Angular)
                         */
                        for (let i = 1; i < 99999; i++)
                            window.clearInterval(i);
                    }
                }

            }, 1020);
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

    playVideo() {
        this.player.playVideo();
        this.isPlayed = true;
    }

    pauseVideo() {
        this.player.pauseVideo();
        this.isPlayed = false;
    }


    toggleVideo() {
        this.isPlayed ? this.pauseVideo() : this.playVideo();
    }

    toggleSound() {
        if(this.player.isMuted()) {
            this.isMuted = false;
            this.player.unMute();
        }
        else {
            this.isMuted = true;
            this.player.mute();
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