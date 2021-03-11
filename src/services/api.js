import axios from 'axios'
import store from "../services/store";

const baseURLLocal = 'http://localhost:3000/'
const baseURLWeb = 'https://gimoveis-api.herokuapp.com/'

const api = axios.create({
    baseURL: process.env.NODE_ENV === "production" ? baseURLWeb : baseURLLocal,
    headers: {
        'Accept':'application/json',
        'Content': 'application/json',
        'Authorization': 'Bearer ' + store
    }
})

export default api
