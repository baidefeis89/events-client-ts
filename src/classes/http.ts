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
                    console.log(http.responseText);
                    if (http.status == 200) {
                        console.log('status ok',url,method);
                        try {
                            resolve(JSON.parse(http.responseText));
                        } catch(error) {
                            reject(`Server response is not valid JSON: ${http.responseText}`);
                        }
                    } else {
                        console.log('status failed',http.status,http.statusText,url,method);
                        reject(`HTTP status: ${http.status} -> ${http.statusText}`);
                    }
                }
            });

        });
    }
}
