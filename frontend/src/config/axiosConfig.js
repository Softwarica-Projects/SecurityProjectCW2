import axios from 'axios';
import { handleError } from '../utils/toastUtils';
import store from '../store';
import { logout } from '../store/slices/userSlice';

const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const token = store.getState().user.token;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response && (error.response.status === 403|| error.response.status === 401)) {
            const userRole = store.getState().user.role;
            const path = window.location.pathname;
            
            store.dispatch(logout());
            
            if (
                path === '/admin/login' ||
                path === '/login' ||
                path === '/'
            ) {
            } else {
                handleError(error, 'Session Expired, Please login to continue');
                if (userRole === 'admin') {
                    window.location.href = '/admin/login';
                } else {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;