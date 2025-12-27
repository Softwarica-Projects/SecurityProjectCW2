import axios from '../config/axiosConfig';

export const getUserProfile = async () => {
    const response = await axios.get('/auth/me');
    return response.data;
};

export const updateUserProfile = async (profileData) => {
    const response = await axios.put('/auth/update-profile', profileData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const changePassword = async (passwordData) => {
    const encode = (s) => {
        try {
            return typeof btoa === 'function' ? btoa(s) : Buffer.from(s).toString('base64');
        } catch (e) {
            return s;
        }
    };

    const payload = { ...passwordData };
    if (payload.oldPassword) payload.oldPassword = encode(payload.oldPassword);
    if (payload.newPassword) payload.newPassword = encode(payload.newPassword);

    const response = await axios.post('/auth/change-password', payload);
    return response.data;
};

export const getUserStats = async () => {
    try {
        const response = await axios.get('/auth/stats');
        return response.data;
    } catch (error) {
        return {
            ratedMoviesCount: 0,
            viewedMoviesCount: 0,
            mostViewedMovie: null
        };
    }
};
