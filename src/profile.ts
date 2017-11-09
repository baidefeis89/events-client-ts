import { Auth } from "./classes/authentication";
import { Http } from "./classes/http";
import { PROFILE_PATH } from "./contants";
import { IUser } from "./interfaces/iuser";

declare function require(module: string): any;
let template = require('../templates/profile.handlebars');

let user: IUser;

window.addEventListener('load', e => {
    Auth.checkToken().then( response => {
        if (!response) {
            location.assign('./login.html');
        } else {
            let urlData = location.search;
            let profile = urlData.split("=")[1] || 'me';
            Http.ajax('GET',`${PROFILE_PATH}${profile}`).then( response => {
                if (response.ok) {
                    user = response.profile;
                    console.log(response);
                    compileHandlebar();
                } else {
                    location.assign('./login.html');
                }
            });
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
