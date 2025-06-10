import axios from 'axios';

/**
 * Creates an Axios instance with default configurations.
 * This instance is used for making HTTP requests throughout the application.
 */
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
    withCredentials: true,
});

export default axiosInstance;
