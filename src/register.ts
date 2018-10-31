import { Auth } from "./classes/authentication";
import { IUser } from "./interfaces/iuser";
import { Geolocation } from "./classes/geolocation";

let positionLat;
let positionLng;
let lat = <HTMLInputElement>document.getElementById('lat');
let lng = <HTMLInputElement>document.getElementById('lng');
let image;

Geolocation.getLocation().then(position => {
    positionLat = position.coords.latitude;
    positionLng = position.coords.longitude;
    
    lat.value = positionLat;
    lng.value = positionLng;
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

document.getElementById('form-register').addEventListener('submit', e => {
    e.preventDefault();
    let name = <HTMLInputElement>document.getElementById('name');
    let email = <HTMLInputElement>document.getElementById('email');
    let email2 = <HTMLInputElement>document.getElementById('email2');
    let password = <HTMLInputElement>document.getElementById('password');
   
    let userInfo: IUser = {
        name: name.value,
        email: email.value,
        email2: email2.value,
        password: password.value,
        avatar: image,
        lat: parseInt(lat.value),
        lng: parseInt(lng.value)
    };

    Auth.register(userInfo).then( res => {
        location.assign('./login.html');   
    }).catch( err => {
        let errorInfo = document.getElementById('errorInfo');
        errorInfo.innerHTML = 'Error al registrarse: ';
        err.forEach( x => {
            errorInfo.innerHTML += x + '<br>';
        });
    });

});
