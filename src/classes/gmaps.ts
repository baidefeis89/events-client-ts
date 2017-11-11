import { load as loadGMaps, urlSettings as gmapsSettings } from 'google-maps-promise';

export class GMaps {
    map: any;
    autocomplete: any;
    coords: any;
    divMap: any;

    constructor(coords: {latitude: number, longitude: number}, divMap: HTMLDivElement) {
        gmapsSettings.key = 'AIzaSyDsm-KdVSm6e36pNcmjOz9CbxB9Yq_9fCc';
        gmapsSettings.language = 'es';
        gmapsSettings.region = 'ES';
        gmapsSettings.libraries = ['geometry', 'places'];
        this.map = null;
        this.autocomplete = null;
        this.coords = coords;
        this.divMap = divMap;
    }

    getMap(): Promise<google.maps.Map> { // Returns Promise!
        if (this.map !== null) return new Promise((resolve, reject) => resolve(this.map));
        
        return loadGMaps().then((gmaps) => {
            let gLatLng = new google.maps.LatLng(this.coords.latitude, this.coords.longitude);
            
            let options = {
                zoom: 17, // Map zoom (min: 0, max: 20)
                center: gLatLng, // Center the map in our position
                mapTypeId: google.maps.MapTypeId.ROADMAP // Map type (also SATELLITE, HYBRID, TERRAIN)
            };
            
            this.map = new google.maps.Map(this.divMap, options);
            return this.map;
        }); // gmaps -> google.maps
    }

    createMarker(lat: number, lng: number, color: string): google.maps.Marker {
        if(this.map === null) return;

        let gLatLng = new google.maps.LatLng(lat, lng);
        var opts = {
            position: gLatLng,
            map: this.map,
            icon: 'http://maps.google.com/mapfiles/ms/icons/' + color + '-dot.png'
        };
        
        return new google.maps.Marker(opts);
    }

    showInfoWindow(marker, content) {
        if(this.map === null) return;

        var infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(content);
        infoWindow.open(this.map, marker);
        
    }

    getAutocomplete(input: HTMLInputElement) {
        if(this.autocomplete !== null) return this.autocomplete;

        var autocomplete = new google.maps.places.Autocomplete(input);
        autocomplete.bindTo('bounds', this.map);
        this.autocomplete = autocomplete;
        return autocomplete;
    }
}
