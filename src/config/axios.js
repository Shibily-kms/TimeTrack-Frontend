import axios from 'axios'
const token = false

const instance = axios.create({
    baseURL: 'http://localhost:8000/',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
    }
})

export default instance;

