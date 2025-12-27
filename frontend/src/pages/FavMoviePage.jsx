import { useEffect, useState } from "react";

import Movie from "../components/Movie";
import { getFavMovies, getPurchasedMovies } from "../services/movieService";
import PublicLayout from "../layout/PublicLayout";
import LoadingBar from "../components/LoadingBar";

const FavMoviePage = () => {
    const [movies, setMovies] = useState([]);
    const [purchased, setPurchased] = useState([]);
    const [loading, setLoading] = useState(false);


    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                await Promise.all([loadMovies(), loadPurchased()]);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const loadMovies = async () => {
        const response = await getFavMovies();
        setMovies(response);
    };
    const loadPurchased = async () => {
        const response = await getPurchasedMovies();
        setPurchased(response);
    };
    return (
        <PublicLayout>
            <div className="pt-20">
                <div className="grid grid-cols-1 gap-8">
                    <div>
                        <h2 className="text-[#FFFDE3] font-bold md:text-xl p-4">Favorites</h2>
                        <div className="items-center ml-2 group">
                            {loading ? (
                                <LoadingBar />
                            ) : movies.length > 0 ? (
                                movies.map((item, index) => (
                                    <Movie key={`fav_${index}`} movie={item} showRating={true} />
                                ))
                            ) : (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-[#FFFDE3] text-lg">No favorite movies found</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-[#FFFDE3] font-bold md:text-xl p-4">Purchased</h2>
                        <div className="items-center ml-2 group">
                            {loading ? (
                                <LoadingBar />
                            ) : purchased.length > 0 ? (
                                purchased.map((item, index) => (
                                    <Movie key={`purchased_${index}`} movie={item} showRating={true} />
                                ))
                            ) : (
                                <div className="flex justify-center items-center py-8">
                                    <div className="text-[#FFFDE3] text-lg">No purchased movies found</div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PublicLayout>
    );
};

export default FavMoviePage;
