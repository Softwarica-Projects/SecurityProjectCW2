import { useState } from "react";
import { AiFillStar } from "react-icons/ai";

const ReviewModal = ({ 
    showReviewModal, 
    setShowReviewModal, 
    reviewData, 
    setReviewData, 
    submittingReview, 
    handleReviewSubmit 
}) => {
    const handleStarClick = (rating) => {
        setReviewData({ ...reviewData, rating });
    };

    if (!showReviewModal) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
                <h3 className="text-white text-2xl font-bold mb-6">Add Your Review</h3>

                <div className="mb-6">
                    <div className="flex items-center space-x-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => handleStarClick(star)}
                                className="focus:outline-none"
                            >
                                <AiFillStar
                                    className={`text-3xl cursor-pointer transition-colors ${
                                        star <= reviewData.rating
                                            ? 'text-orange-400'
                                            : 'text-gray-400 hover:text-orange-300'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <label className="block text-white text-sm font-medium mb-2">
                        Review (Optional)
                    </label>
                    <textarea
                        value={reviewData.review}
                        onChange={(e) => setReviewData({ ...reviewData, review: e.target.value })}
                        placeholder="Share your thoughts about this movie..."
                        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows="4"
                    />
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => {
                            setShowReviewModal(false);
                            setReviewData({ rating: 0, review: '' });
                        }}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium transition-colors"
                        disabled={submittingReview}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleReviewSubmit}
                        disabled={submittingReview || reviewData.rating === 0}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors"
                    >
                        {submittingReview ? 'Submitting...' : 'Submit Review'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;
