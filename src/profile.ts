import { Auth } from "./classes/authentication";
import { Http } from "./classes/http";
import { PROFILE_PATH } from "./contants";
import { IUser } from "./interfaces/iuser";
import { User } from "./classes/user";

declare function require(module: string): any;
let template = require('../templates/profile.handlebars');

let user: User;

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
                compileHandlebar();
            }).catch (err => {
                location.assign('./login.html');
            });
            /*Http.ajax('GET',`${PROFILE_PATH}${profile}`).then( response => {
                if (response.ok) {
                    user = response.profile;
                    console.log(response);
                    compileHandlebar();
                } else {
                    location.assign('./login.html');
                }
            });*/
        }

    }).catch( err => {
        console.log(err);
        location.assign('./login.html');
    });
});

let compileHandlebar = () => {
    let container = document.getElementById('profile');
    container.innerHTML = template(user);
};
