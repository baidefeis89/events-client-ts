import { Auth } from "./classes/authentication";
import { User } from "./classes/user";

let user: User;
let image = '';

document.getElementById('logout').addEventListener('click', e => {
    Auth.logout();
    location.assign('./login.html');
});

window.addEventListener('load', e => {
    Auth.checkToken().then( response => {
        if (!response) {
            location.assign('./login.html');
        } else {
            let urlData = location.search;
            let profile = +urlData.split("=")[1] || null;
            User.getProfile(profile).then( response => {
                user = new User(response);
                document.getElementById('avatar').setAttribute('src',`http://arturober.com/svtickets-services/public/img/profile/${user.avatar}`);
            }).catch (err => {
                location.assign('./login.html');
            });
        }

    }).catch( err => {
        console.log(err);
        location.assign('./login.html');
    });
});

document.getElementById('form-profile').addEventListener('submit', e => {
    e.preventDefault();

    let name = <HTMLInputElement> document.getElementById('name');
    let email = <HTMLInputElement> document.getElementById('email');

    user.saveProfile(name.value,email.value).then( response => {
        document.getElementById('errorInfo1').innerHTML = '';        
        document.getElementById('okInfo1').innerHTML = 'Profile update successful';
    }).catch( err => {
        document.getElementById('okInfo1').innerHTML = '';        
        document.getElementById('errorInfo1').innerHTML = err;
    });
});

document.getElementById('image').addEventListener('change', e => {
    let fileInput = <HTMLInputElement>document.getElementById('image');
    if (!fileInput.files || fileInput.files.length === 0 ) return;
    const reader: FileReader = new FileReader();
    reader.readAsDataURL(fileInput.files[0]);
    reader.addEventListener('loadend', e => {
      image = reader.result;
      document.getElementById('avatar').setAttribute('src',image);    
    });
});

document.getElementById('form-avatar').addEventListener('submit', e => {
    e.preventDefault();

    if (image != '') {
        user.saveAvatar(image).then( response => {
            document.getElementById('errorInfo2').innerHTML = '';        
            document.getElementById('okInfo2').innerHTML = 'Avatar update successful';
        }).catch( err => {
            document.getElementById('okInfo2').innerHTML = '';        
            document.getElementById('errorInfo2').innerHTML = err;
        });
    } else {
        document.getElementById('okInfo2').innerHTML = '';        
        document.getElementById('errorInfo2').innerHTML = 'Select a new avatar';
    }
});

document.getElementById('form-password').addEventListener('submit', e => {
    e.preventDefault();

    let password = <HTMLInputElement> document.getElementById('password');
    let password2 = <HTMLInputElement> document.getElementById('password2');

    user.savePassword(password.value,password2.value).then( response => {
        document.getElementById('errorInfo3').innerHTML = '';        
        document.getElementById('okInfo3').innerHTML = 'Password update successful';
    }).catch( err => {
        document.getElementById('okInfo3').innerHTML = '';        
        document.getElementById('errorInfo3').innerHTML = err;
    });
});

