import axios from '../config/axiosConfig';
import {encryptString} from './userService';

export const registerUser = async (userData) => {
    const payload = { ...userData };
    if (payload.password) payload.password = await encryptString(payload.password);

    const response = await axios.post('/auth/register', payload);
    return response.data;
};

export const loginUser = async (credentials) => {
    const payload = { ...credentials };
    if (payload.password) payload.password = await encryptString(payload.password);

    const response = await axios.post('/auth/login', payload);
    return response.data;
};

