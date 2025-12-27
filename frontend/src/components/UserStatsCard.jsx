import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserStats } from '../services/userService';
import StatBlock from './StatBlock';
import MovieCard from './MovieCard';

const UserStatsCard = ({ user }) => {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        ratedMoviesCount: 0,
        viewedMoviesCount: 0,
        mostViewedMovie: null
    });
    const [loading, setLoading] = useState(true);

    const favoriteIcon = (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    );

    const ratingIcon = (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    );

    const viewIcon = (
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    const handleMovieClick = () => {
        if (stats.mostViewedMovie && stats.mostViewedMovie._id) {
            navigate(`/movies/${stats.mostViewedMovie._id}`);
        }
    };

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const statsData = await getUserStats();
                setStats(statsData);
            } catch (error) {
                setStats({
                    ratedMoviesCount: 0,
                    viewedMoviesCount: 0,
                    mostViewedMovie: null
                });
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchStats();
        }
    }, [user]);

    if (loading) {
        return (
            <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Activity Stats</h3>
                <div className="animate-pulse space-y-4">
                    <div className="h-4 bg-gray-600 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-600 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-600 rounded w-5/6"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6">Activity Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link to={"/favourites"}>
                    <StatBlock
                        icon={favoriteIcon}
                        count={stats.favouriteMoviesCount || 0}
                        label="Favourite Movies"
                        bgColor="bg-red-600"
                    /></Link>

                <StatBlock
                    icon={ratingIcon}
                    count={stats.ratedMoviesCount || 0}
                    label="Movies Rated"
                    bgColor="bg-yellow-600"
                />
                <StatBlock
                    icon={viewIcon}
                    count={stats.viewedMoviesCount || 0}
                    label="Movies Viewed"
                    bgColor="bg-green-600"
                />
            </div>

            <MovieCard
                movie={stats.mostViewedMovie}
                onClick={handleMovieClick}
                title="Most Viewed Movie"
            />
        </div>
    );
};

export default UserStatsCard;
