import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { getMovies, searchMovies } from "../services/movieService";
import { getGenres } from "../services/genreService";
import Movie from "../components/Movie";
import PublicLayout from "../layout/PublicLayout";
import LoadingBar from "../components/LoadingBar";

const MoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [genres, setGenres] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortBy, setSortBy] = useState('');
    const [orderBy, setOrderBy] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                await Promise.all([loadMovies(), loadGenres()]);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const loadMovies = async () => {
        const response = await searchMovies(searchTerm, selectedGenre, sortBy, orderBy);
        setMovies(response);
    };

    const loadGenres = async () => {
        const response = await getGenres();
        setGenres(response);
    };

    const handleSearch = async () => {
        setLoading(true);
        try {
            await loadMovies();
        } catch (error) {
            console.error('Error searching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSetSortBy = (value) => {
        setSortBy(value);
        if (value == "rating" || value == "views" || value == "releasedate" || value == "featured") {
            setOrderBy('desc');
        }
    }

    const handleReset = () => {
        setSearchTerm('');
        setSelectedGenre('');
        setSortBy('');
        setOrderBy('');
        loadMovies();
    };
    return (
        <PublicLayout>
            <div className="pt-20">
                <div className="bg-gray-800 p-6 rounded-lg mb-6 shadow-lg mx-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                        <div className="lg:col-span-2">
                            <label className="block text-[#FFFDE3] text-sm font-medium mb-2">
                                Search Movies
                            </label>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by title or description..."
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-[#FFFDE3] text-sm font-medium mb-2">
                                Genre
                            </label>
                            <select
                                value={selectedGenre}
                                onChange={(e) => setSelectedGenre(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">All Genres</option>
                                {genres.map((genre) => (
                                    <option key={genre._id} value={genre._id}>
                                        {genre.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[#FFFDE3] text-sm font-medium mb-2">
                                Filter
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => handleSetSortBy(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Default</option>
                                <option value="rating">Rating</option>
                                <option value="views">Views</option>
                                <option value="releasedate">Release Date</option>
                                <option value="featured">Featured</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-[#FFFDE3] text-sm font-medium mb-2">
                                Order
                            </label>
                            <select
                                value={orderBy}
                                onChange={(e) => setOrderBy(e.target.value)}
                                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">Default</option>
                                <option value="asc">Ascending</option>
                                <option value="desc">Descending</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            {loading ? 'Searching...' : 'Search'}
                        </button>
                        <button
                            onClick={handleReset}
                            disabled={loading}
                            className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-500 text-white rounded-md font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                        >
                            Reset
                        </button>
                    </div>
                </div>


                <div className="items-center ml-2 group">
                    {loading ? (
                        <LoadingBar/>
                    ) : movies.length > 0 ? (
                        movies.map((item, index) => {
                            return (
                                <Movie key={`_${index}`} movie={item} showRating={true}></Movie>
                            );
                        })
                    ) : (
                        <div className="flex justify-center items-center py-8">
                            <div className="text-[#FFFDE3] text-lg">No movies found</div>
                        </div>
                    )}
                </div>
            </div>
        </PublicLayout>
    );
};

export default MoviePage;
