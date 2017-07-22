import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {routing} from "./app.routing";
import {AuthService} from "./auth/auth.service";
import {AuthComponent} from "./auth/auth.component";
import { CategoryComponent } from './category/category.component';
import {MusicService} from "./shared/music.service";
import { DashboardComponent } from './dashboard/dashboard.component';
import { PlayerComponent } from './dashboard/player/player.component';
import {HashLocationStrategy, LocationStrategy} from "@angular/common";

import { YoutubePlayerModule } from 'ng2-youtube-player';

import { SafePipe } from './safe.pipe';
import {MomentModule} from "angular2-moment";
import { DurationPipe } from './duration.pipe';
import { ShortenPipe } from './shorten.pipe';
import { RadioComponent } from './dashboard/radio/radio.component';
import { MusicManageComponent } from './dashboard/music-manage/music-manage.component';
import { PlaylistsComponent } from './dashboard/playlists/playlists.component';
import { ErrorComponent } from './shared/alert-box/alert-box.component';
import {AlertService} from "./shared/alert-box/alert.service";



@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AuthComponent,
        CategoryComponent,
        DashboardComponent,
        PlayerComponent,
        SafePipe,
        DurationPipe,
        ShortenPipe,
        RadioComponent,
        MusicManageComponent,
        PlaylistsComponent,
        ErrorComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing,
        YoutubePlayerModule,
        MomentModule,
        ReactiveFormsModule,

    ],
    providers: [
        AuthService,
        MusicService,
        AlertService,
        //Allow refresing the app in production
        {provide: LocationStrategy, useClass: HashLocationStrategy},
        ],
    bootstrap: [AppComponent]
})
export class AppModule { }