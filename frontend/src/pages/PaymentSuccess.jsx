import { useEffect, useState } from 'react';
import PublicLayout from '../layout/PublicLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyTransaction } from '../services/paymentService';
import { handleError } from '../utils/toastUtils';
import { useAuth } from '../hooks/useAuth';

const PaymentSuccess = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sessionId = params.get('session_id');
        const movieId = params.get('movieId');

        const verify = async () => {
            if (!isAuthenticated) {
                setMessage('Please log in to verify your purchase.');
                setLoading(false);
                return;
            }
            try {
                const resp = await verifyTransaction({ movieId: movieId || '', sessionId });
                if (resp && resp.success) {
                    setStatus('verified');
                    setMessage('Payment verified successfully. Thank you!');
                } else {
                    setStatus('failed');
                    setMessage((resp && resp.message) || 'Verification failed');
                }
            } catch (err) {
                setStatus('error');
                setMessage(err?.response?.data?.message || 'Verification error');
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [location.search, isAuthenticated]);


    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-3xl font-bold mb-4">Payment Successful</h1>
                    <p className="mb-4">{loading ? 'Verifying your payment...' : message}</p>
                        <button className="bg-cyan-600 py-2 px-4 rounded" onClick={() => navigate('/')}>Go Home</button>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PaymentSuccess;
