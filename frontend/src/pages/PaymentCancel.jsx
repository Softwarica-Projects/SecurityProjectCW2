import PublicLayout from '../layout/PublicLayout';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();
    return (
        <PublicLayout>
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-3xl font-bold mb-4">Payment Cancelled</h1>
                    <p className="mb-4">Your payment was cancelled. You can try again.</p>
                    <button className="bg-cyan-600 py-2 px-4 rounded" onClick={() => navigate(-1)}>Go Back</button>
                </div>
            </div>
        </PublicLayout>
    );
};

export default PaymentCancel;
