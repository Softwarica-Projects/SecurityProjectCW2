import axios from '../config/axiosConfig';

export const createCheckoutSession = async (movieId) => {
    const response = await axios.post(`/movies/${movieId}/checkout`);
    const data = response.data || {};
    return data;
};

export const checkPurchaseStatus = async (movieId) => {
    const response = await axios.get(`/movies/${movieId}/is-purchased`);
    return response.data;
};

export const getTransactions = async () => {
    const response = await axios.get('/movies/transactions/list');
    return response.data;
};

export const verifyTransaction = async ({ movieId, sessionId }) => {
    const params = {};
    if (sessionId) params.session_id = sessionId;
    const response = await axios.get(`/movies/${movieId}/verify-transaction`, { params });
    return response.data;
};

export const createTransactionFromSession = async ({ sessionId }) => {
    const response = await axios.post(`/movies/create-transaction-from-session`, { sessionId });
    return response.data;
};
