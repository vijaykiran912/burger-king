import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://burger-king-5f393.firebaseio.com/'
});

export default instance;