import {Song} from "./song.model";

export class Playlist {

    constructor(public user: {id: string, email: string, firstName:string, lastName:string, gravatarHash:string},
                public songs:Song[],
                public id:string) {}
}