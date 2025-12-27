import { AiFillStar } from "react-icons/ai";

const ReviewsSection = ({ 
    ratings, 
    role, 
    setShowReviewModal 
}) => {
    if (!ratings) return null;

    return (
        <div className="py-12 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-white text-3xl font-bold">Reviews ({ratings.length})</h2>
                    {role && (
                        <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200"
                            onClick={() => setShowReviewModal(true)}
                        >
                            Add Review
                        </button>
                    )}
                </div>
                <div className="space-y-6">
                    {ratings.map((rating, index) => (
                        <div key={index} className="bg-gray-700 rounded-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                        <span className="text-white font-bold">
                                            {rating.userId?.name?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">
                                            {rating.userId?.name || 'Anonymous User'}
                                        </h4>
                                        <div className="flex items-center">
                                            {[...Array(5)].map((_, starIndex) => (
                                                <AiFillStar
                                                    key={starIndex}
                                                    className={`text-sm ${
                                                        starIndex < rating.rating
                                                            ? 'text-orange-400'
                                                            : 'text-gray-400'
                                                    }`}
                                                />
                                            ))}
                                            <span className="text-gray-300 text-sm ml-2">
                                                {rating.rating}/5
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {rating.review && (
                                <p className="text-gray-300 leading-relaxed">{rating.review}</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ReviewsSection;
