import { Auth } from "./classes/authentication";
import { EventItem } from "./classes/event";

declare function require(module: string): any;
let template = require('../templates/event.handlebars');

let event: EventItem[];
let info = {
    event:[] 
}

document.getElementById('logout').addEventListener('click', e => {
    Auth.logout();
    location.assign('./login.html');
});

document.getElementById('orderDistance').addEventListener('click', e => {
    info.event = event.sort( (ev1, ev2) => ev1.distance - ev2.distance );
    compileHandlebar();
    console.log(info.event);
});

document.getElementById('orderDate').addEventListener('click', e => {
    info.event = event.sort( (ev1, ev2) => {
        if(ev1.date>ev2.date) return 1;
        if(ev1.date<ev2.date) return -1;
        return 0;
    })
    compileHandlebar();
    console.log(info.event);
});

document.getElementById('searchEvent').addEventListener('keyup', e=> {
    let input = <HTMLInputElement>document.getElementById('searchEvent');
    info.event = event.filter( ev => ev.title.toLocaleLowerCase().includes(input.value.toLocaleLowerCase()));
    compileHandlebar();
});

document.getElementById('orderPrice').addEventListener('click', e => {
    info.event = event.sort( (ev1, ev2) => ev1.price - ev2.price );
    compileHandlebar();
});

let compileHandlebar = () => {
    let container = document.getElementById('eventsContainer');
    container.innerHTML = template(info);
};

window.addEventListener('load', e => {
    if (localStorage.getItem('token')) {
        Auth.checkToken().then( response => {
            if (!response) {
                location.assign('./login.html');
                localStorage.removeItem('token');
            }
        }).catch( err => {
            console.log(err);
            location.assign('./login.html');
        });
    } else {
        location.assign('./login.html');
    }

    EventItem.getEvents().then( response => {
        event = response;
        console.log(event);

        info.event = event;

        compileHandlebar();
        
    });
    

})
