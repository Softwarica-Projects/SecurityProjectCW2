import axios from '../config/axiosConfig';

export const registerUser = async (userData) => {
    const payload = { ...userData };
    if (payload.password) payload.password = encode(payload.password);

    const response = await axios.post('/auth/register', payload);
    return response.data;
};
const encode = (s) => {
    try {
        return btoa(s);
    } catch (e) {
        return s;
    }
};
export const loginUser = async (credentials) => {
    const payload = { ...credentials };
    if (payload.password) payload.password = encode(payload.password);

    const response = await axios.post('/auth/login', payload);
    return response.data;
};

