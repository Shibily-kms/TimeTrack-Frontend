import axios from 'axios'
import Cookies from 'js-cookie';
import { doSignOut } from '../assets/javascript/auth-helper';
export const baseUrl = 'http://192.168.1.57'
const apiHeaders = { 'Content-Type': 'application/json' }

//* Base Setup
const baseSetup = {
    userAxios: axios.create({ baseURL: `${baseUrl}:8000/`, headers: apiHeaders }),
    adminAxios: axios.create({ baseURL: `${baseUrl}:8000/admin/`, headers: apiHeaders }),


    //? v2.1
    ttSv2Axios: axios.create({ baseURL: `${baseUrl}:8000/s/v2/`, headers: apiHeaders }),
    ttCv2Axios: axios.create({ baseURL: `${baseUrl}:8000/c/v2/`, headers: apiHeaders })
}

//*  Response and Request Config Functions

const handleTokenError = async (originalRequest) => {
    originalRequest._retry = true;

    // Call the refresh token API to get a new access token
    try {
        const refreshToken = Cookies.get('_rfs_tkn'); // Retrieve the refresh token
        const { data } = await axios.post(`${baseUrl}:8000/s/v2/auth/rotate-token`, { refresh_token: refreshToken }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const cookieOptions = {
            secure: false,
            sameSite: 'lax',
            path: '/',
            expires: 40
        };

        Cookies.set('_acc_tkn', data?.data?.access_token, cookieOptions);
        originalRequest.headers['Authorization'] = `Bearer ${data?.data?.access_token}`;

        return userAxios(originalRequest); // Retry original request with new access token
    } catch (err) {
        doSignOut()
    }

}

const requestConfigFunction = (config) => {
    let userToken = Cookies.get('_acc_tkn')
    if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
        config.timeout = 10000
    }
    return config
}

const requestErrorFunction = (error) => {
    return Promise.reject(error);
}

const responseConfigFunction = (response) => {
    // Handle successful responses here if needed
    return response.data;
}

const responseErrorFunction = async (error) => {

    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
        await handleTokenError(originalRequest);
    } else if (error.response.status === 403 || error.response.status === 401) {
        doSignOut(error.response.status === 403)
    } else if (error.code === 'ECONNABORTED') {
        return Promise.reject({ ...error.response.data, message: 'No proper internet connection' });
    } else if (error.response?.data?.statusCode >= 400 && error.response?.data?.statusCode < 500) {
        return Promise.reject({ message: error.response?.data?.message });
    }

    return Promise.reject({ message: 'Unknown Error' });
}

//* API interceptors

//? userAuth
baseSetup.userAxios.interceptors.request.use(requestConfigFunction, requestErrorFunction)
baseSetup.userAxios.interceptors.response.use(responseConfigFunction, responseErrorFunction);

//? adminAuth
baseSetup.adminAxios.interceptors.request.use(requestConfigFunction, requestErrorFunction)
baseSetup.adminAxios.interceptors.response.use(responseConfigFunction, responseErrorFunction);

//? time track v2 all
baseSetup.ttSv2Axios.interceptors.request.use(requestConfigFunction, requestErrorFunction)
baseSetup.ttSv2Axios.interceptors.response.use(responseConfigFunction, responseErrorFunction);

//? time track v2 all
baseSetup.ttCv2Axios.interceptors.request.use(requestConfigFunction, requestErrorFunction)
baseSetup.ttCv2Axios.interceptors.response.use(responseConfigFunction, responseErrorFunction);


export const { userAxios, adminAxios, ttSv2Axios, ttCv2Axios } = baseSetup


