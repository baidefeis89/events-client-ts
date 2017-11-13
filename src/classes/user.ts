import { IUser } from '../interfaces/iuser';
import { Http } from './http';
import { PROFILE_PATH, 
        UPDATE_PROFILE_PATH, 
        UPDATE_AVATAR_PATH, 
        UPDATE_PASSWORD_PATH } from "../contants";

export class User implements IUser {
    id?: number;
    name: string;
    avatar: string;
    email: string;
    email2?: string; // Register form will send this
    password?: string;
    lat?: number;
    lng?: number;
    me?: boolean; // If the user is the current logged user

    constructor(user: IUser) {
        this.id = user.id,
        this.name = user.name,
        this.avatar = user.avatar,
        this.email = user.email,
        this.email2 = user.email2,
        this.password = user.password,
        this.lat = user.lat,
        this.lng = user.lng,
        this.me = user.me
    }

    static getProfile(id?: number): Promise<User> {
        let param = id || 'me';
        return Http.ajax('GET', `${PROFILE_PATH}${param}`).then( response => {
            if (response.ok)
                return new User(response.profile);
            else
                throw response.error;
        });
    }

    saveProfile(name: string, email: string): Promise<boolean> {
        let data = {
            email: email,
            name: name
        };
        return Http.ajax('PUT',UPDATE_PROFILE_PATH,data).then( response => {
            if (response.ok) 
                return response.ok;
            else
                throw response.error;
        });
    }

    saveAvatar(avatar: string): Promise<boolean> {
        let data = {avatar: avatar};
        return Http.ajax('PUT',UPDATE_AVATAR_PATH,data).then( response => {
            if (response.ok) 
                return response.ok;
            else
                throw response.error;
        });
    }

    savePassword(password: string, password2: string): Promise<boolean> {
        let pass = {
            password: password,
            password2: password2
        };

        return Http.ajax('PUT',UPDATE_PASSWORD_PATH,pass).then( response => {
            if (response.ok)
                return response.ok;
            else
                throw response.error;
        });
    }
}
