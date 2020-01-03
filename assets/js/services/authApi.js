import axios from 'axios';
import jwtDecode from 'jwt-decode';

function logOut(){
    window.localStorage.removeItem("authToken");
    delete axios.defaults.headers['Authorization'];
}

function setAxiosToken(token){
    axios.defaults.headers["Authorization"] = "Bearer "+ token;
}

function authenticate (credentials){
  return axios
    .post("http://localhost:8000/api/login_check",credentials)
    .then(response => response.data['token'])
    .then(token =>{
        window.localStorage.setItem('authToken',token);
        //On previent axios qu'on a un header par defautl sur toutes nos futurs requetes
        setAxiosToken(token)
    });
}

function isAuthenticated(){
    const token = window.localStorage.getItem("authToken");
    if(token){
        if(jwtDecode(token).exp * 1000 > new Date().getTime()){
            return true;
        }
        return false;
    }
    return false;
}

function setup(){
    const token = window.localStorage.getItem("authToken");
    isAuthenticated() && (axios.defaults.headers["Authorization"] = "Bearer "+ token);
}

export default {
    authenticate,
    logOut,
    setup,
    isAuthenticated
}