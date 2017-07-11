
export class User {
    constructor(public email:string,
                public password:string,
                public firstName?:string,
                public lastName?:string,
                public birthdate?:Date,
                public gravatarHash?:string,
                public isAdmin:boolean = false) {}
}