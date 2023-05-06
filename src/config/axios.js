import axios from 'axios'

let admin = JSON.parse(localStorage.getItem('adminData'))
admin = admin?.token
let user = JSON.parse(localStorage.getItem('userData'))
user = user?.token

const baseSetup = {
    userAxios: axios.create({
        baseURL: 'http://localhost:8000/',
        headers: {
            'Authorization': `Bearer ${user}`,
            'Content-Type': 'application/json'
        }
    }),
    adminAxios: axios.create({
        baseURL: 'http://localhost:8000/admin/',
        headers: {
            'Authorization': `Bearer ${admin}`,
            'Content-Type': 'application/json'
        }
    })
}

export const { userAxios, adminAxios } = baseSetup


