import axios from 'axios'


const baseSetup = {
    userAxios: axios.create({
        // baseURL: 'http://localhost:8000/',
        baseURL: 'https://staffbackend.alliancewatersolutions.com/',
        headers: {
            'Content-Type': 'application/json'
        }
    }),
    adminAxios: axios.create({
        // baseURL: 'http://localhost:8000/admin/',
        baseURL: 'https://staffbackend.alliancewatersolutions.com/admin/',
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

// Add an interceptor to userAxios
baseSetup.userAxios.interceptors.request.use(config => {
    let user = JSON.parse(localStorage.getItem('userData'))
    config.headers['Authorization'] = `Bearer ${user?.token}`
    return config
})

// Add an interceptor to adminAxios
baseSetup.adminAxios.interceptors.request.use(config => {
    let admin = JSON.parse(localStorage.getItem('adminData'))
    config.headers['Authorization'] = `Bearer ${admin?.token}`
    return config
})

export const { userAxios, adminAxios } = baseSetup


