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

            let buttonDelete = document.querySelector("button.btn-danger");
            if (document.querySelector("button.btn-danger")) {
              buttonDelete.addEventListener("click", e => {
                if (confirm('Delete this event?')) {
                    event.delete().then( response => {
                        if (response) {
                            location.assign('./index.html');
                        }
                    });
                }
              });
            }
            
        }).catch( err => {
            location.assign('./index.html');
        });
    }
        
});


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
