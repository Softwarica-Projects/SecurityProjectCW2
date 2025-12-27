import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../layout/PublicLayout';
import ProfileUpdateDialog from '../components/ProfileUpdateDialog';
import ChangePasswordDialog from '../components/ChangePasswordDialog';
import UserStatsCard from '../components/UserStatsCard';
import { getUserProfile } from '../services/userService';
import { handleError } from '../utils/toastUtils';
import LoadingBar from '../components/LoadingBar';
import { useAuth } from '../hooks/useAuth';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showUpdateDialog, setShowUpdateDialog] = useState(false);
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);
    const navigate = useNavigate();
    const { token, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchUserProfile();
    }, [navigate, isAuthenticated]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const userData = await getUserProfile();
            setUser(userData);
        } catch (error) {
            handleError(error);
            navigate('/login');
        } finally {
            setLoading(false);
        }
    };

    const handleProfileUpdate = () => {
        fetchUserProfile();
    };

    if (loading) {
        return (
            <PublicLayout>
                <LoadingBar />
            </PublicLayout>
        );
    }

    if (!user) {
        return (
            <PublicLayout>
                <div className=" min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-white mb-4">Profile not found</h1>
                        <button
                            onClick={() => navigate('/login')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Go to Login
                        </button>
                    </div>
                </div>
            </PublicLayout>
        );
    }

    return (
        <PublicLayout>
            <div className="pt-20 min-h-screen bg-black py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-gray-800 rounded-lg p-6 mb-8">
                        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                            <div className="relative">
                                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-600 flex items-center justify-center">
                                    {user.image ? (
                                        <img
                                            src={user.image}
                                            alt={user.name}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-white text-4xl font-bold">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 text-left">
                                <h1 className="text-3xl font-bold text-white mb-2">{user.name}</h1>
                                <p className="text-gray-400 text-lg mb-4">{user.email}</p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={() => setShowUpdateDialog(true)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit Profile
                                    </button>
                                    <button
                                        onClick={() => setShowPasswordDialog(true)}
                                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Change Password
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800 rounded-lg p-6 mb-8">
                        <h2 className="text-2xl font-bold text-white mb-4">Account Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-blue-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <h3 className="text-white font-semibold">Full Name</h3>
                                </div>
                                <p className="text-gray-300">{user.name}</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-green-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <h3 className="text-white font-semibold">Email Address</h3>
                                </div>
                                <p className="text-gray-300">{user.email}</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-purple-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                    </svg>
                                    <h3 className="text-white font-semibold">Role</h3>
                                </div>
                                <p className="text-gray-300 capitalize">{user.role || 'User'}</p>
                            </div>

                            <div className="bg-gray-700 rounded-lg p-4">
                                <div className="flex items-center mb-2">
                                    <svg className="w-5 h-5 text-yellow-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h3 className="text-white font-semibold">Member Since</h3>
                                </div>
                                <p className="text-gray-300">{user.createdAt.split("T")[0] }</p>
                            </div>
                        </div>
                    </div>

                    <UserStatsCard user={user} />
                </div>

                <ProfileUpdateDialog
                    isOpen={showUpdateDialog}
                    onClose={() => setShowUpdateDialog(false)}
                    user={user}
                    onUpdate={handleProfileUpdate}
                />

                <ChangePasswordDialog
                    isOpen={showPasswordDialog}
                    onClose={() => setShowPasswordDialog(false)}
                />
            </div>
        </PublicLayout>
    );
};

export default ProfilePage;
