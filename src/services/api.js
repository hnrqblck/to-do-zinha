import axios from 'axios';

export default axios.create({
    baseURL: 'http://144.126.213.60',
    headers: {
        'Content-Type': 'application/json',
    },
});