import { EventItem } from "./classes/event";
import { Auth } from "./classes/authentication";
import { Geolocation } from "./classes/geolocation";
import { GMaps } from "./classes/gmaps";

declare function require(module: string): any;
let template = require('../templates/event.handlebars');

let event: EventItem;
let info = {
    event:[] 
}
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
        console.log('not a number');
    } else {
        Auth.checkToken().then( response => {
            if (!response) {
                location.assign('./login.html');
            }
        }).catch( err => {
            console.log(err);
            location.assign('./login.html');
        });
    
        EventItem.getEvent(id).then( response => {
            event = response;
            console.log(event);

            compileHandlebar();

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

            
            
        }).catch( err => {
            location.assign('./index.html');
        });
    }
        
});

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
            }
            
        });
        
    });
}

let compileHandlebar = () => {
    let container = document.getElementById('cardContainer');
    info.event.push(event);
    container.innerHTML = template(info);
};

function clickMarker(marker) {
    google.maps.event.addListener(marker, 'click', event => {
        gmap.showInfoWindow(marker, "Marker at lat: " + event.latLng.lat().toFixed(6) +
                                    ", lng: " + event.latLng.lng().toFixed(6));
    });
}
