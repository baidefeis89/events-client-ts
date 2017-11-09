import { Auth } from "./classes/authentication";

window.addEventListener('load', e => {

    Auth.checkToken()
        .then( response => {
            if(response){
                location.assign('./index.html');
            } else {

                document.getElementById('form-login').addEventListener('submit', e => {
                    e.preventDefault();
                    let email = <HTMLInputElement>document.getElementById('email');
                    let password = <HTMLInputElement>document.getElementById('password');
                    let loginInfo = {
                        email: email.value,
                        password: password.value
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
            }

        });
    
});