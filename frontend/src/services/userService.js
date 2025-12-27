import axios from '../config/axiosConfig';

export const encryptString = async (plain) => {
        const passphrase = process.env.REACT_APP_ENCRYPTION_PASSPHRASE;
        if (!passphrase) return plain;
        try {
            const enc = new TextEncoder();
                const saltEnv = process.env.REACT_APP_ENCRYPTION_SALT;
                let salt;
                if (saltEnv) {
                    // decode base64 salt into Uint8Array
                    const raw = typeof atob === 'function' ? atob(saltEnv) : Buffer.from(saltEnv, 'base64').toString('binary');
                    const arr = new Uint8Array(raw.length);
                    for (let i = 0; i < raw.length; ++i) arr[i] = raw.charCodeAt(i);
                    salt = arr;
                } else {
                    salt = enc.encode('static-salt-please-change');
                }
            const keyMaterial = await window.crypto.subtle.importKey('raw', enc.encode(passphrase), { name: 'PBKDF2' }, false, ['deriveKey']);
            const key = await window.crypto.subtle.deriveKey({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, { name: 'AES-GCM', length: 256 }, true, ['encrypt']);
            const iv = window.crypto.getRandomValues(new Uint8Array(12));
            const ciphertext = await window.crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, enc.encode(plain));
            const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
            combined.set(iv, 0);
            combined.set(new Uint8Array(ciphertext), iv.byteLength);
            const b64 = typeof btoa === 'function' ? btoa(String.fromCharCode(...combined)) : Buffer.from(combined).toString('base64');
                return `${b64}`;
        } catch (e) {
            return plain;
        }
    };
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
    

    const payload = { ...passwordData };
    if (payload.oldPassword) payload.oldPassword = await encryptString(payload.oldPassword);
    if (payload.newPassword) payload.newPassword = await encryptString(payload.newPassword);

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
