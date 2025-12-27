import { useSelector, useDispatch } from 'react-redux';
import { login, logout, updateProfile, syncWithLocalStorage } from '../store/slices/userSlice';
import {
    selectUser,
    selectUserToken,
    selectUserId,
    selectUserName,
    selectUserRole,
    selectIsAuthenticated,
    selectIsAdmin,
    selectIsUser,
} from '../store/selectors/userSelectors';

export const useAuth = () => {
    const dispatch = useDispatch();

    /// [Selectors]
    const user = useSelector(selectUser);
    const token = useSelector(selectUserToken);
    const userId = useSelector(selectUserId);
    const userName = useSelector(selectUserName);
    const userRole = useSelector(selectUserRole);
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const isAdmin = useSelector(selectIsAdmin);
    const isUser = useSelector(selectIsUser);

    /// [Actions]
    const loginUser = (userData) => {
        dispatch(login(userData));
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    const updateUserProfile = (profileData) => {
        dispatch(updateProfile(profileData));
    };

    const syncWithStorage = () => {
        dispatch(syncWithLocalStorage());
    };

    return {
        user,
        token,
        userId,
        userName,
        userRole,
        isAuthenticated,
        isAdmin,
        isUser,
        loginUser,
        logoutUser,
        updateUserProfile,
        syncWithStorage,
    };
};
