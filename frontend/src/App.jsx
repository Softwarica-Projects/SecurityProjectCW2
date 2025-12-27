import { useEffect } from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './hooks/useAuth';
import HomePage from './pages/HomePage';
import Login from './pages/user/Login';
import Register from './pages/user/Register';

function App() {
    const { syncWithStorage } = useAuth();

    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'id' || e.key === 'name' || e.key === 'role') {
                syncWithStorage();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, [syncWithStorage]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={3000} />
            <Router>
                <Routes>
                    {/* [Public Routest] */}
                    <Route path="/" element={<HomePage />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/movies/:id" element={<MovieDetail />} />
                    <Route path="/movies" element={<MoviePage />} />
                    <Route path="/payment-success" element={<PaymentSuccess />} />
                    <Route path="/payment-cancel" element={<PaymentCancel />} />

                    <Route path="/favourites" element={
                        <ProtectedRoute role="admin,user">
                            <FavMoviePage />
                        </ProtectedRoute>} />

                    <Route path="/profile" element={
                        <ProtectedRoute role="admin,user">
                            <ProfilePage />
                        </ProtectedRoute>} />
                    {/* [Admin Routes. ] */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminDashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/movies"
                        element={
                            <ProtectedRoute role="admin">
                                <MoviesManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/movies/create"
                        element={
                            <ProtectedRoute role="admin">
                                <AddMoviePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/movies/update/:id"
                        element={
                            <ProtectedRoute role="admin">
                                <AddMoviePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/genres"
                        element={
                            <ProtectedRoute role="admin">
                                <GenresManagement />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/admin/user-list"
                        element={
                            <ProtectedRoute role="admin">
                                <AdminsManagement />
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </Router>
        </>
    );
}

export default App;