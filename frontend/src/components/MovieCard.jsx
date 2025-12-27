import { getImageUrl } from '../utils/imageUtils';
import Tag from './Tag';

const MovieCard = ({ movie, onClick, title = "Featured Movie" }) => {
    if (!movie) return null;

    return (
        <div className="mt-6 bg-white rounded-lg p-4 shadow">
            <div className="flex items-start gap-4">
                <div className="w-20 h-28 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    {movie.coverImage ? (
                        <img src={getImageUrl(movie.coverImage)} alt={movie.title} className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">No Image</div>
                    )}
                </div>

                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h4 className="text-lg font-semibold text-slate-900 truncate">{movie.title}</h4>
                        <div className="text-sm text-slate-500">{movie.views} views</div>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                        <div className="text-sm text-slate-600">{movie.genre?.name || ''}</div>
                        <button onClick={onClick} className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">View</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
