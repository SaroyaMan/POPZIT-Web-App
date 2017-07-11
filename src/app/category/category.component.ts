import {Component, OnDestroy, OnInit} from '@angular/core';
import * as $ from 'jquery';
import {MusicService} from "../shared/music.service";
import {Subgenre} from "../shared/subgenre.model";
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";

@Component({
    selector: 'app-category',
    templateUrl: './category.component.html',
    styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit, OnDestroy {

    bodyClass = 'categoryBackground';
    categories:Subgenre[] = [];
    selectedIndex:boolean[] = [];

    isValid:boolean = false;

    constructor(private musicService:MusicService,
                private router:Router,
                private authService:AuthService) { }

    ngOnInit() {
        $('body').addClass(this.bodyClass);
        if(!this.authService.isLoggedIn()) {
            this.router.navigate(['']);
        }
        this.musicService.getSubgenres()
            .subscribe( (categories:Subgenre[]) => this.categories = categories);

    }

    ngOnDestroy() {
        $('body').removeClass(this.bodyClass);
    }

    clickCategory(index:number) {
        this.selectedIndex[index] = !this.selectedIndex[index];
        for(let i of this.selectedIndex) {
            if(i === true) {
                this.isValid = true;
                return;
            }
        }
        this.isValid = false;
    }

    onSubmit() {
        let selectedSubgenres:Subgenre[] = [];
        for(let index in this.categories) {
            if(this.selectedIndex[index]) {
                selectedSubgenres.push(this.categories[index]);
            }
        }
        console.log(selectedSubgenres);
        this.musicService.initSelectedAlbums(selectedSubgenres);
        this.router.navigate(['/dashboard/radio']);
    }
}
