import { Http } from "./classes/http";
import { EVENTS_PATH } from "./contants";
import { INewEvent } from "./interfaces/inewevent";
import { Geolocation } from "./classes/geolocation";
import { GMaps } from "./classes/gmaps";
import { Auth } from "./classes/authentication";

let data: INewEvent;
let gmap = null;
let position = {
    lat: null,
    lng: null
};
let image;

document.getElementById('logout').addEventListener('click', e => {
    Auth.logout();
    location.assign('./login.html');
});

document.getElementById('image').addEventListener('change', e => {
    let fileInput = <HTMLInputElement>document.getElementById('image');
    if (!fileInput.files || fileInput.files.length === 0 ) return;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', e => {
      image = reader.result;
    });
});

document.getElementById('newEvent').addEventListener('submit', e => {
    e.preventDefault();

    let title = <HTMLInputElement> document.getElementById('title');
    let description = <HTMLInputElement> document.getElementById('description');
    let price = <HTMLInputElement> document.getElementById('price');
    let date = <HTMLInputElement> document.getElementById('date');
    let address = <HTMLInputElement> document.getElementById('address');
    let img;

    data = {
        title: title.value,
        description: description.value,
        price: +price.value,
        date: date.value,
        address: address.value,
        lat: position.lat,
        lng: position.lng,
        image: image
    };
    
    Http.ajax('POST',EVENTS_PATH,data).then( response => {
        if (response.ok) {
            location.assign('./index.html');
        } else {
            let errorPlace = document.getElementById('errorInfo');
            response.errors.forEach( err => errorPlace.innerHTML += err + '<br>');
        }
    })
})

function changeAutocomplete(autocomplete) {
    let map = gmap.map; // The map should be already loaded

    google.maps.event.addListener(autocomplete, 'place_changed', event => {
        let place = autocomplete.getPlace();
        if (!place.geometry) return;
        
        map.panTo(place.geometry.location);
        gmap.createMarker(place.geometry.location.lat(), place.geometry.location.lng(), "red");
        document.getElementById("address").innerText = place.formatted_address;

        position.lat = place.geometry.location.lat();
        position.lng = place.geometry.location.lng();
    }); 
}

function clickMap(position) {
    let map = gmap.map; // The map should be already loaded

    google.maps.event.addListener(map, 'click', event => {
        map.panTo(event.latLng); 
        let marker = gmap.createMarker(event.latLng.lat(), event.latLng.lng(), "red");

        clickMarker(marker);
        var dist = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(position.coords.latitude, position.coords.longitude), // Our position
            event.latLng // This position
        );
        document.getElementById("address").innerText = "Created a marker at lat: " + event.latLng.lat() +
            ", lng: " + event.latLng.lng() + "\n" +
            "Distance from you: " + (Math.round(dist)/1000) + "km";
                            
        position.lat = event.latLng.lat();
        position.lng = event.latLng.lng();
        let address = <HTMLInputElement>document.getElementById("address");
        address.value = `${position.lat}, ${position.lng}`;
    });
}

function clickMarker(marker) {
    google.maps.event.addListener(marker, 'click', event => {
        gmap.showInfoWindow(marker, "Marker at lat: " + event.latLng.lat().toFixed(6) +
                                    ", lng: " + event.latLng.lng().toFixed(6));
        position.lat = event.latLng.lat();
        position.lng = event.latLng.lng();
    });
}

window.addEventListener('load', function () {
    Geolocation.getLocation().then(response => {
        position.lat = response.coords.latitude;
        position.lng = response.coords.longitude;
        let address = <HTMLInputElement>document.getElementById("address");
        address.value = `${response.coords.latitude}, ${response.coords.longitude}`;
        let divMap = <HTMLDivElement> document.getElementById('map');
        gmap = new GMaps(response.coords, divMap);
        gmap.getMap().then(map => {            
            clickMap(response); // Initializes click event on the map 

            let marker = gmap.createMarker(response.coords.latitude, response.coords.longitude, "red");
            clickMarker(marker); // Initializes click event on the marker 

            let autocomplete = gmap.getAutocomplete(document.getElementById("address"));
            changeAutocomplete(autocomplete); // Initializes place_changed event on the autocomplete 
        });

    }).catch(error => {
        console.error(error);
    });
});
