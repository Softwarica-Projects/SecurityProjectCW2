import axios from '../config/axiosConfig';

export const createGenre = async (genreData) => {
    const response = await axios.post('/genres', genreData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const getGenres = async () => {
    const response = await axios.get('/genres');
    return response.data;
};

export const getGenreById = async (id) => {
    const response = await axios.get(`/genres/${id}`);
    return response.data;
};

export const updateGenre = async (id, genreData) => {
    const response = await axios.put(`/genres/${id}`, genreData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const deleteGenre = async (id) => {
    const response = await axios.delete(`/genres/${id}`);
    return response.data;
};