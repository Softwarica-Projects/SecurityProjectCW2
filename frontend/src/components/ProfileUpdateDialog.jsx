import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { updateUserProfile } from '../services/userService';
import { handleError, handleSuccess } from '../utils/toastUtils';
import { useAuth } from '../hooks/useAuth';

const ProfileUpdateDialog = ({ isOpen, onClose, user, onUpdate }) => {
    const [profileImage, setProfileImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(user?.image || null);
    const { updateUserProfile: updateReduxProfile } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        watch
    } = useForm({
        defaultValues: {
            name: user?.name || '',
            email: user?.email || ''
        }
    });

    const watchedName = watch('name');

    useEffect(() => {
        if (user) {
            reset({
                name: user.name || '',
                email: user.email || ''
            });
            setImagePreview(user.image || null);
        }
    }, [user, reset]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const onSubmit = async (data) => {
        try {
            const submitData = new FormData();
            submitData.append('name', data.name);
            submitData.append('email', data.email);
            if (profileImage) {
                submitData.append('image', profileImage);
            }

            const response = await updateUserProfile(submitData);
            updateReduxProfile({ name: data.name });
            handleSuccess(response.message || 'Profile updated successfully');
            onUpdate();
            onClose();
        } catch (error) {
            handleError(error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white">Update Profile</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-white text-2xl font-bold">
                                        {watchedName?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                )}
                            </div>
                            <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                        <input
                            type="text"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: {
                                    value: 2,
                                    message: 'Name must be at least 2 characters'
                                }
                            })}
                            className={`w-full p-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                        <input
                            type="email"
                            {...register('email', {
                                required: 'Email is required',
                                pattern: {
                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                    message: 'Enter a valid email address'
                                }
                            })}
                            className={`w-full p-3 bg-gray-700 border rounded-lg text-white focus:outline-none focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-600'
                                }`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isSubmitting ? 'Updating...' : 'Update'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfileUpdateDialog;
