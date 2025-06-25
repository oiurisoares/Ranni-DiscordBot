import axios from 'axios';

/**
 * Creates an Axios instance with default configurations.
 * This instance is used for making HTTP requests throughout the application.
 * --
 * @type {import('axios').AxiosInstance}
 * @property {string} headers ['Content-Type'] - The content type for the requests.
 * @property {number} timeout - The timeout for requests in milliseconds.
 * @property {boolean} withCredentials - Indicates whether to send cookies with requests.
 */
const axiosInstance = axios.create({
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 5000,
    withCredentials: true,
});

export default axiosInstance;
