import {Http, Headers, Response} from "@angular/http";
import {Injectable} from "@angular/core";
import {Subgenre} from "./subgenre.model";
import {Observable} from "rxjs/Observable";
import 'rxjs/Rx';
import {Album} from "./album.model";
import {Song} from "./song.model";
import {AuthService} from "../auth/auth.service";
import {Playlist} from "./playlist.model";

@Injectable()
export class MusicService {

    selectedAlbums:Album[] = [];
    selectedSong:Song;

    private playlist:Song[] = [];
    private currentSongIndex = -1;

    reset() {
        this.selectedAlbums = [];
        this.selectedSong = null;
        this.currentSongIndex = -1;
    }

    constructor(private http:Http,
                private authService:AuthService) {
        this.playlist.map( (song) => song.name );
    }

    getSubgenres() {
        return this.http.get('http://localhost:3000/music/defaultSubgenres')
            .map( (response) => {
                const subgenresJson = response.json();
                let transformedSubgenres:Subgenre[] = [];
                for(let subgenre of subgenresJson) {
                    let albums = [];
                    for(let album of subgenre.albums) {
                        albums.push(album);
                    }
                    transformedSubgenres.push(new Subgenre(subgenre.name, albums));
                }
                return transformedSubgenres;
            })
            .catch( (error:Response) => Observable.throw(error.json() ))
    }

    initPlaylist() {
        let userId = localStorage.getItem('userId');
        return this.http.get(`http://localhost:3000/music/playlist?userId=${userId}`)
            .map( (response) => {
                let playlistJson = response.json().songs;
                let songs:Song[] = [];
                for(let song of playlistJson) {
                    songs.push(
                        new Song(song.name, song.artist, song.youtubeId, song.album)
                    );
                }
                return songs;
            })
            .catch( (error:Response) => Observable.throw(error.json() ));
    }

    //noinspection JSMethodCanBeStatic
    initSelectedAlbums(selectedSubgenres:Subgenre[]) {
        for(let subgenre of selectedSubgenres) {
            this.selectedAlbums.push(...subgenre.albums);
        }
    }

    initSong(song:Song, isPlay?:boolean) {
        this.http.get(`http://localhost:3000/music/youtubeSong?artist=${song.artist}&track=${song.name}`)

            .map( (response) => {
                const parsedSongJson = response.json();
                song.youtubeId =  parsedSongJson.youtubeId;
                console.log(song);
                return song;
            })
            .catch( (error:Response) => Observable.throw(error.json()) )
            .subscribe( (parsedSong:Song) => {
                song = parsedSong;
                if(isPlay) {
                    this.selectedSong = song;
                    this.currentSongIndex = -1;
                }
            });
    }



    addSongToPlaylist(song:Song) {
        let indexSong = this.playlist.indexOf(song);
        if(!this.playlist[indexSong]) {
            this.initSong(song);
            this.playlist.push(song);
        }
    }

    getNextSong() {
        this.currentSongIndex++;
        this.selectedSong = this.playlist[this.currentSongIndex %= this.playlist.length];
    }

    getPrevSong() {
        this.currentSongIndex = this.currentSongIndex-1 == -1 ? this.playlist.length-1 : --this.currentSongIndex;
        this.selectedSong = this.playlist[this.currentSongIndex %= this.playlist.length];
    }

    isPlaylistEmpty() {return this.playlist.length === 0}

    getPlaylist() {return this.playlist;}
    setPlaylist(songs:Song[]) {this.playlist = songs;}

    getCurrentSongIndex() {return this.currentSongIndex;}

    playSongByIndex(index:number) {
        this.selectedSong = this.playlist[this.currentSongIndex = index];
    }

    searchSong(artist:string, track:string) {
        return this.http.get(`http://localhost:3000/music/song?artist=${artist}&track=${track}`)
            .map( (response) => {
                const searchSongJson = response.json();
                console.log(searchSongJson);
                if(searchSongJson.imagePath === 'unknown') return null;
                return new Song(track, artist, null, new Album(artist, searchSongJson.album, searchSongJson.imagePath))
            })
            .catch( (error:Response) =>
                Observable.throw(error.json())
            )

    }

    removeSongFromPlaylist(index:number) {
        this.playlist.splice(index,1);
    }

    savePlaylist() {
        let tempPlaylist = this.playlist.slice();
        for(let song of tempPlaylist) {
            song.album.songs = null;
            song.album.artist = null;
        }
        let userId = localStorage.getItem('userId');
        let playlistBody = {
            user: userId,
            songs: tempPlaylist
        };
        const body = JSON.stringify(playlistBody);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/music/savePlaylist', body, {headers: headers})
            .map( (response:Response) => {
                return response.json();
            } )
            .catch( (error:Response) => Observable.throw(error));
    }

    publishPlaylist() {
        let tempPlaylist = this.playlist.slice();
        for(let song of tempPlaylist) {
            song.album.songs = null;
            song.album.artist = null;
        }
        let user = this.authService.signedUser;
        let userId = localStorage.getItem('userId');

        let playlistBody = {
            user: {
                id: userId,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                birthdate: user.birthdate,
                gravatarHash: user.gravatarHash,
            },
            songs: tempPlaylist
        };
        const body = JSON.stringify(playlistBody);
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/music/publishPlaylist', body, {headers: headers})
            .map( (response:Response) => {
                return response.json();
            } )
            .catch( (error:Response) => Observable.throw(error));
    }

    getPublicPlaylists() {
        return this.http.get(`http://localhost:3000/music/allAdminPlaylists`)
            .map( (response) => {
                const playlistsJson = response.json();
                let playlists:Playlist[] = [];
                for(let playlist of playlistsJson) {
                    playlists.push(new Playlist(playlist.user, playlist.songs, playlist._id));
                }
                return playlists;
            })
            .catch( (error:Response) =>
                Observable.throw(error.json())
            )
    }

    deletePlaylist(playlist:Playlist) {
        const body = JSON.stringify({id: playlist.id});
        const headers = new Headers({'Content-Type': 'application/json'});
        return this.http.post('http://localhost:3000/music/removeAdminPlaylist', body, {headers: headers})
            .map( (response) => {
                return response.json();
            })
            .catch( (error:Response) => Observable.throw(error.json()) );
    }
}