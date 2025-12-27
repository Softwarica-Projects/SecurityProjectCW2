import { toast } from 'react-toastify';

export const handleError = (error, defaultMsg = 'Something went wrong') => {
    if (error?.response?.status === 401||error?.response?.status === 403) {
        return;
    }
    const msg =
        error?.response?.data?.message ||
        error?.message ||
        defaultMsg;
    toast.error(msg);
};

export const handleSuccess = (message = 'Success') => {
    toast.success(message);
};