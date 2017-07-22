import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'shorten'
})
export class ShortenPipe implements PipeTransform {

    transform(value: any, args?: any): any {
        if(value.toString().length > 25) {
            return (<string>value).substr(0,22) + "...";
        }
        return value;
    }

}
