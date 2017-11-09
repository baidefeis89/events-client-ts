import { IEvent } from './interfaces/ievent';
import { IUser } from "./interfaces/iuser";
import { Http } from "./classes/http";
import { EVENT_PATH } from "./contants";
import { Auth } from "./classes/authentication";

declare function require(module: string): any;
let template = require('../templates/event.handlebars');

let event: IEvent;
let info = {
    event:[] 
}

window.addEventListener('load', e => {

    let search = location.search;
    let id: number = Number(search.split('=')[1]);
    if( isNaN(id) ) {
        location.assign('./index.html');
    } else {
        Auth.checkToken().then( response => {
            if (!response) {
                location.assign('./login.html');
            }
        }).catch( err => {
            console.log(err);
            location.assign('./login.html');
        });
    
        Http.ajax('GET', `${EVENT_PATH}${id}`).then( response => {
            if (!response.ok) {
                location.assign('./index.html');
            }
            event = response.event;
            console.log(event);

            compileHandlebar();
        });
    }
        
});

let compileHandlebar = () => {
    let container = document.getElementById('cardContainer');
    info.event.push(event);
    container.innerHTML = template(info);
};
