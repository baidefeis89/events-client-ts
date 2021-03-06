import { EventItem } from "./classes/event";
import { Auth } from "./classes/authentication";
import { Geolocation } from "./classes/geolocation";
import { GMaps } from "./classes/gmaps";
import { User } from "./classes/user";

declare function require(module: string): any;
let templateEvent = require('../templates/event.handlebars');
let templateUsers = require('../templates/usercard.handlebars');

let event: EventItem;
let info = {
    event:[],
    user:[] 
};
let usersAttendees: User[];
let gmap;

document.getElementById('logout').addEventListener('click', e => {
    Auth.logout();
    location.assign('./login.html');
});

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
            location.assign('./login.html');
        });
    
        EventItem.getEvent(id).then( response => {
            event = response;

            compileHandlebar(event,'cardContainer',templateEvent);

            createClickEvent();
            attendButton();

            let position = {
                latitude: event.lat,
                longitude: event.lng
            }
            let divMap = <HTMLDivElement> document.getElementById('map');
            gmap = new GMaps(position, divMap);
            gmap.getMap().then(map => {                           
                let marker = gmap.createMarker(position.latitude, position.longitude, "red");
                clickMarker(marker);
            });

            getAttendees();
            
        }).catch( err => {
            location.assign('./index.html');
        });



    }
        
});

let getAttendees = () => {
    event.getAttendees().then( (response: User[]) => {
        usersAttendees = response;
        compileHandlebar(usersAttendees,'userList',templateUsers);
    }).catch( err => {
        console.log(err);
    });
}

let createClickEvent = () => {
    if (event.mine) {
        document.getElementById("buttonDelete"+event.id).addEventListener("click", e => {
            if (confirm('Delete this event?')) {
                event.delete().then( response => {
                    if (response) {
                        location.assign('./index.html');
                    }
                });
            }
        });
    }
}

let attendButton = () => {

    let button =  document.getElementById('attend' + event.id);
    button.addEventListener('click', e=> {
        event.toggleAttend().then( response => {
            if (response) {
                if (event.attend) {
                    button.setAttribute('class', 'btn btn-success float-right');
                    button.innerHTML = 'Attend';
                } else {
                    button.setAttribute('class', 'btn btn-secondary float-right');
                    button.innerHTML = 'No Attend';
                }
                getAttendees();
            }
            
        });
        
    });
}

let compileHandlebar = (data,id,template) => {
    let container = document.getElementById(id);
    if (id === 'cardContainer') {
        info.event.push(data);
        container.innerHTML = template(info);
    } 
    if (id === 'userList') {
        info.user = data;
        container.innerHTML = template(info);  
    }
};

function clickMarker(marker) {
    google.maps.event.addListener(marker, 'click', event => {
        gmap.showInfoWindow(marker, "Marker at lat: " + event.latLng.lat().toFixed(6) +
                                    ", lng: " + event.latLng.lng().toFixed(6));
    });
}
