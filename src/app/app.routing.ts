import {RouterModule, Routes} from "@angular/router";
import {HomeComponent} from "./home/home.component";
import {AuthComponent} from "./auth/auth.component";
import {CategoryComponent} from "./category/category.component";
import {DashboardComponent} from "./dashboard/dashboard.component";
import {RadioComponent} from "app/dashboard/radio/radio.component";
import {MusicManageComponent} from "./dashboard/music-manage/music-manage.component";
import {PlaylistsComponent} from "app/dashboard/playlists/playlists.component";

const APP_ROUTES:Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'category', component: CategoryComponent},
    {path: 'dashboard', component: DashboardComponent, children: [
        {path: 'radio', component: RadioComponent},
        {path: 'music', component: MusicManageComponent},
        {path: 'playlists', component: PlaylistsComponent}
    ]},
    {path: 'auth', component: AuthComponent, loadChildren: './auth/auth.module#AuthModule'}
];

export const routing = RouterModule.forRoot(APP_ROUTES);