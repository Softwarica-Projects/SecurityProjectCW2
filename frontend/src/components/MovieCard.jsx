import { getImageUrl } from '../utils/imageUtils';
import Tag from './Tag';

const MovieCard = ({ movie, onClick, title = "Featured Movie" }) => {
    if (!movie) return null;

    return (
        <div className="mt-6 bg-gray-700 rounded-lg p-4">
            <h4 className="text-lg font-semibold text-white mb-3">{title}</h4>
            <div className="relative">
                {movie.purchased && (
                    <div className="absolute top-0 left-0 m-2 z-10">
                        <Tag color="bg-indigo-600">Purchased</Tag>
                    </div>
                )}
                <div
                    className="flex items-center cursor-pointer hover:bg-gray-600 rounded-lg p-2 transition-colors duration-200"
                    onClick={onClick}
                >
                    <div className="w-16 h-24 bg-gray-600 rounded-lg mr-4 overflow-hidden">
                        {movie.coverImage ? (
                            <img
                                src={getImageUrl(movie.coverImage)}
                                alt={movie.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center" data-testid="movie-placeholder">
                                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1h-1v12a2 2 0 01-2 2H6a2 2 0 01-2-2V7H3a1 1 0 01-1-1V5a1 1 0 011-1h4z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="text-white font-medium">{movie.title}</p>
                        <p className="text-gray-400 text-sm">{movie.views} views</p>
                        {movie.genre && (
                            <p className="text-gray-400 text-sm">{movie.genre.name}</p>
                        )}
                    </div>
                    <div className="ml-4">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
