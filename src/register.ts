import { Auth } from "./classes/authentication";
import { IUser } from "./interfaces/iuser";

document.getElementById('form-register').addEventListener('submit', e => {
    e.preventDefault();
    let name = <HTMLInputElement>document.getElementById('name');
    let email = <HTMLInputElement>document.getElementById('email');
    let email2 = <HTMLInputElement>document.getElementById('email2');
    let password = <HTMLInputElement>document.getElementById('password');
    let image = <HTMLInputElement>document.getElementById('image');
    let lat = <HTMLInputElement>document.getElementById('lat');
    let lng = <HTMLInputElement>document.getElementById('lng');
    let img;

    const reader: FileReader = new FileReader();
    reader.readAsDataURL(image.files[0]);
    reader.addEventListener('loadend', e => {
      img = reader.result;
    });
    
    let userInfo: IUser = {
        name: name.value,
        email: email.value,
        email2: email2.value,
        password: password.value,
        avatar: img,
        lat: parseInt(lat.value),
        lng: parseInt(lng.value)
    };

    //TODO Check the response when the promise failed
    Auth.register(userInfo).then( res => {
        if (res)
            location.assign('./login.html');
        else
            document.getElementById('errorInfo').innerHTML = 'Error al registrarse';    
    }).catch( err => {
        console.log(err);
        document.getElementById('errorInfo').innerHTML = 'Error al registrarse: ' + err;
    });

});
