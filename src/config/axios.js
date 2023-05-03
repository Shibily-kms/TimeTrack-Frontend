import axios from 'axios'
let token = JSON.parse(localStorage.getItem('adminData'))
token = token?.token 


const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})

export default instance;

