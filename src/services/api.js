import axios from 'axios'
import store from "../services/store";

const api = axios.create({
    baseURL: 'http://localhost:3000/',
    // baseURL: 'http://192.168.2.43:3000/',
    headers: {
        'Accept':'application/json',
        'Content': 'application/json',
        'Authorization': 'Bearer ' + store
    }
})

export default api