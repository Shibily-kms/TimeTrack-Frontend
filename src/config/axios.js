import axios from 'axios'


const baseSetup = {
    userAxios: axios.create({
        baseURL: 'http://localhost:8000/',
        // baseURL: 'https://staffbackend.alliancewatersolutions.com/',
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    adminAxios: axios.create({
        baseURL: 'http://localhost:8000/admin/',
        // baseURL: 'https://staffbackend.alliancewatersolutions.com/admin/',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// Add an interceptor to userAxios
baseSetup.userAxios.interceptors.request.use(config => {
    let userToken = localStorage.getItem('_tkn_stf')
    config.headers['Authorization'] = `Bearer ${userToken}`
    return config
})

// Add an interceptor to adminAxios
baseSetup.adminAxios.interceptors.request.use(config => {
    let adminToken = localStorage.getItem('_tkn_adn')
    config.headers['Authorization'] = `Bearer ${adminToken}`
    return config
})

export const { userAxios, adminAxios } = baseSetup


