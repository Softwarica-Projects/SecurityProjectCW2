import axios from '../config/axiosConfig';

export const createAdmin = async (adminData) => {
    const response = await axios.post('/admin/add-admin', adminData);
    return response.data;
};

export const getAllUser = async () => {
    const response = await axios.get('/admin/all-users');
    return response.data;
};

export const deleteAdmin = async (id) => {
    const response = await axios.delete(`/admin/${id}`);
    return response.data;
};