import { Auth } from "./classes/authentication";
import { Geolocation } from "./classes/geolocation";
import { GMaps } from "./classes/gmaps";

let positionLat;
let positionLng;

window.addEventListener('load', e => {

    Auth.checkToken()
        .then( response => {
            if (response) location.assign('./index.html');
            console.log(response);
        }).catch( err => {

            Geolocation.getLocation().then(position => {
                positionLat = position.coords.latitude;
                positionLng = position.coords.longitude;
            });

            document.getElementById('form-login').addEventListener('submit', e => {
                e.preventDefault();
                let email = <HTMLInputElement>document.getElementById('email');
                let password = <HTMLInputElement>document.getElementById('password');
                let loginInfo = {
                    email: email.value,
                    password: password.value,
                    lat: positionLat,
                    lng: positionLng
                };
                
                if(loginInfo.email != '' && loginInfo.password != ''){
                    Auth.login(loginInfo).then( response => {
                        if (response) {
                            console.log("Success");
                            location.assign('./index.html')
                        }
                        else {
                            console.log("failed");
                            document.getElementById('errorInfo').innerHTML = 'Nombre de usuario o contraseña incorrectos';
                        }
                        
                    }).catch( err => {
                        console.log(err);
                    });
                }
                
            });
        });

});
