import axios from 'axios'
export const baseUrl = 'http://staff.alliancewatersolutions.com'

const baseSetup = {
    userAxios: axios.create({
        baseURL: 'https://staffbackend.alliancewatersolutions.com/',
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    adminAxios: axios.create({
        baseURL: 'https://staffbackend.alliancewatersolutions.com/admin/',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}


/* -------------- User Config ---------------*/

const handleUserTokenError = () => {
    // Redirect the user to the login page or perform any other necessary action
    window.location.href = `${baseUrl}/login`
}

const requestConfigUserFunction = (config) => {
    let userToken = localStorage.getItem('_aws_temp_tkn')
    if (userToken) {
        config.headers['Authorization'] = `Bearer ${userToken}`;
        config.timeout = 6000
    }
    return config
}

const requestErrorUserFunction = (error) => {
    return Promise.reject(error);
}

const responseConfigUserFunction = (response) => {
    // Handle successful responses here if needed
    return response.data;
}

const responseErrorUserFunction = (error) => {
    if (error.response && error.response.status === 401) {
        handleUserTokenError();
    } else if (error.code === 'ECONNABORTED') {
        return Promise.reject({ ...error.response.data, message: 'No proper internet connection' });
    }

    return Promise.reject(error?.response?.data || { message: error?.message });
}

// Add an interceptor to userAxios for request
baseSetup.userAxios.interceptors.request.use(
    requestConfigUserFunction, requestErrorUserFunction
)

// Add an interceptor to userAxios for response errors
baseSetup.userAxios.interceptors.response.use(
    responseConfigUserFunction, responseErrorUserFunction
);


/* -------------- Admin Config ---------------*/

const handleAdminTokenError = () => {
    // Redirect the user to the login page or perform any other necessary action
    window.location.href = `${baseUrl}/admin/login`
}

const requestConfigAdminFunction = (config) => {
    let adminToken = localStorage.getItem('_aws_temp_tkn_adn')
    if (adminToken) {
        config.headers['Authorization'] = `Bearer ${adminToken}`;
        config.timeout = 6000
    }
    return config
}

const requestErrorAdminFunction = (error) => {
    return Promise.reject(error);
}

const responseConfigAdminFunction = (response) => {
    // Handle successful responses here if needed
    return response.data;
}

const responseErrorAdminFunction = (error) => {
    if (error.response && error.response.status === 401) {
        handleAdminTokenError();
    } else if (error.code === 'ECONNABORTED') {
        return Promise.reject({ ...error.response.data, message: 'No proper internet connection' });
    }
    return Promise.reject(error?.response?.data || { message: error?.message });
}


// Add an interceptor to adminAxios for request
baseSetup.adminAxios.interceptors.request.use(
    requestConfigAdminFunction, requestErrorAdminFunction
)

// Add an interceptor to adminAxios for response errors
baseSetup.adminAxios.interceptors.response.use(
    responseConfigAdminFunction, responseErrorAdminFunction
);

export const { userAxios, adminAxios } = baseSetup


