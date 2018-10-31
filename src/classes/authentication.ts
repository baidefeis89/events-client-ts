import { IUser } from "../interfaces/iuser";
import { LOGIN_PATH, REGISTER_PATH, SERVER, TOKEN_PATH } from "../contants";
import { Http } from "./http";

export class Auth {
    static login(loginInfo: {email: string, password: string}): Promise<boolean> {
        
        return Http.ajax('POST', LOGIN_PATH, loginInfo)
            .then( response => {
                if(response.ok) {
                    localStorage.setItem('token',response.token);
                    return response.ok;
                } else {
                    throw response.error;
                }
            });
    }

    static register(userInfo:IUser): Promise<boolean> {
        return Http.ajax('POST', REGISTER_PATH, userInfo)
            .then( response => {
                if (response.ok) {
                    return response.ok
                }
                else {
                    throw response.errors;
                }
            });
    }

    static checkToken(): Promise<boolean> {
        return Http.ajax('GET', TOKEN_PATH)
            .then( response => {
                if (response.ok)
                    return response.ok;
                else
                    throw false;
            });
    }

    static logout() {
        localStorage.removeItem('token');
    }
}
