import { useEffect, useState } from "react";
import { useNavigate, useParams } from 'react-router-dom';
import { getMovieById, toggleFavMovie, addMovieRating, trackMovieView } from "../services/movieService";
import { createCheckoutSession, checkPurchaseStatus } from '../services/paymentService';
import { loadStripe } from '@stripe/stripe-js';
import PublicLayout from "../layout/PublicLayout";
import MovieTrailer from "../components/MovieTrailer";
import LoadingBar from "../components/LoadingBar";
import { handleError, handleSuccess } from "../utils/toastUtils";
import ReviewModal from "../components/ReviewModal";
import CoverVideo from "../components/CoverVideo";
import MovieInfo from "../components/MovieInfo";
import CastSection from "../components/CastSection";
import ReviewsSection from "../components/ReviewsSection";
import { useAuth } from "../hooks/useAuth";

const MovieDetail = () => {
    const { isAuthenticated, userRole } = useAuth();
    const [movie, setMovie] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isCoverVideoMuted, setIsCoverVideoMuted] = useState(true);
    const [reviewData, setReviewData] = useState({
        rating: 0,
        review: ''
    });
    const [loading, setLoading] = useState(true);
    const [purchased, setPurchased] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        if (id) {
            setLoading(true);
            getMovieById(id).then((response) => {
                setMovie(response);
                setLoading(false);
            }).catch((error) => {
                console.error('Error fetching movie:', error);
                setLoading(false);
            });
            if (isAuthenticated)
                trackMovieView(id).catch((error) => {
                    console.error('Error tracking movie view:', error);
                });
            if (isAuthenticated) {
                checkPurchaseStatus(id).then(res => setPurchased(!!res.purchased)).catch(() => { });
            }
        }
    }, [id]);


    const onFavClick = async () => {
        try {
            setMovie({
                ...movie, isFavourite: !movie.isFavourite
            });
            await toggleFavMovie(id);

        } catch {
            setMovie({
                ...movie, isFavourite: !movie.isFavourite
            });
        }
    }

    const handleReviewSubmit = async () => {
        if (reviewData.rating === 0) {
            alert('Please select a rating');
            return;
        }
        setSubmittingReview(true);
        try {
            await addMovieRating(id, reviewData);
            const updatedMovie = await getMovieById(id);
            setMovie(updatedMovie);
            setReviewData({ rating: 0, review: '' });
            setShowReviewModal(false);
            handleSuccess('Review submitted successfully!');
        } catch (error) {
            handleError(error);
        } finally {
            setSubmittingReview(false);
        }
    };

    const toggleCoverVideoMute = () => {
        setIsCoverVideoMuted(!isCoverVideoMuted);
    };

    if (loading) {
        return (
            <PublicLayout>
                <LoadingBar />
            </PublicLayout>
        );
    }

    if (!movie) {
        return (
            <PublicLayout>
                <div className="flex justify-center items-center h-screen">
                    <p className="text-white text-xl">Movie not found</p>
                </div></PublicLayout>
        );
    }

    const handlePurchase = async () => {
        try {
            const res = await createCheckoutSession(id);
            window.location.href = res.url;
        } catch (err) {
            handleError(err);
        }
    }
    return (
        <PublicLayout>
            <div className="min-h-screen">
                {showModal ? (
                    <MovieTrailer trailerLink={movie.trailerLink} onClick={() => setShowModal(false)}>
                    </MovieTrailer>
                ) : null}

                <ReviewModal
                    showReviewModal={showReviewModal}
                    setShowReviewModal={setShowReviewModal}
                    reviewData={reviewData}
                    setReviewData={setReviewData}
                    submittingReview={submittingReview}
                    handleReviewSubmit={handleReviewSubmit}
                />

                <div className="relative">
                    <CoverVideo
                        movie={movie}
                        isCoverVideoMuted={isCoverVideoMuted}
                        toggleCoverVideoMute={toggleCoverVideoMute}
                        showModal={showModal}
                    />

                    <MovieInfo
                        movie={movie}
                        role={userRole}
                        setShowModal={setShowModal}
                        onFavClick={onFavClick}
                        purchased={purchased}
                        onPurchase={() => handlePurchase()}
                    />

                </div>

                <div className="relative z-10 bg-black">
                    <CastSection cast={movie.cast} />

                    <ReviewsSection
                        ratings={movie.ratings}
                        role={userRole}
                        setShowReviewModal={setShowReviewModal}
                    />
                </div>
            </div>
        </PublicLayout>
    );
};

export default MovieDetail;
