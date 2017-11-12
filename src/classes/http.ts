 import { IResponse } from "../interfaces/iresponse";
 
 export class Http {
    static ajax(method: string, url: string, data: any = null): Promise<IResponse> {
        return new Promise<IResponse>((resolve,reject) => {
            let http = new XMLHttpRequest();
            http.open(method, url, true);
            http.setRequestHeader('Content-Type', 'application/json');
            
            if(localStorage.getItem('token')) {
                http.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('token'));
            }
            
            http.send(JSON.stringify(data));

            http.addEventListener( 'readystatechange', e => {
                if (http.readyState == 4) {
                    if (http.status == 200) {
                        try {
                            resolve(JSON.parse(http.responseText));
                        } catch(error) {
                            reject(`Server response is not valid JSON: ${http.responseText}`);
                        }
                    } else {
                        reject(`HTTP status: ${http.status} -> ${http.statusText}`);
                    }
                }
            });

        });
    }
}
