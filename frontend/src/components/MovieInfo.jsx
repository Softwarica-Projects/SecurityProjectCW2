import { IoMdPlay } from "react-icons/io";
import { AiFillStar } from "react-icons/ai";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { getImageUrl } from '../utils/imageUtils';
import { useState } from 'react';
import LoadingBar from './LoadingBar';

const MovieInfo = ({ 
    movie, 
    role, 
    setShowModal, 
    onFavClick,
    purchased = false,
    onPurchase = () => {}
}) => {
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handlePurchase = async () => {
        try {
            setIsPurchasing(true);
            await onPurchase();
        } catch (e) {
            // parent handles errors; keep local UX simple
        } finally {
            setIsPurchasing(false);
        }
    };
    const price = process.env.REACT_APP_DEFAULT_MOVIE_PRICE_USD || '50';
    return (
        <div className="relative -mt-60 z-20 flex justify-center px-4">
            <div className="flex flex-col items-center md:flex-row md:max-w-2xl lg:max-w-3xl xl:max-w-4xl text-white">
                <div className="lg:w-[30%] h-auto md:h-[400px] w-[70%] mb-6 md:mb-0">
                    <img
                        className="w-full h-full object-cover rounded-md shadow-lg"
                        src={getImageUrl(movie.coverImage)}
                        alt={movie.title}
                    />
                </div>
                <div className="w-full lg:w-[70%] md:pl-12">
                    <p className="text-3xl md:text-5xl mb-3 mt-3 md:mt-0 font-bold">
                        {movie.title}
                    </p>
                    <div className="flex flex-row items-center mb-4">
                        <div className="flex flex-row justify-center items-center mr-5 pb-2 text-orange-400">
                            <AiFillStar className="text-3xl mr-2" />
                            <p className="text-4xl font-bold">
                                {movie?.averageRating?.toFixed(2) || "0.0"}
                            </p>
                        </div>
                        <div className="flex flex-col">
                            <div className="grid grid-flow-col auto-cols-max gap-4">
                                <p className="text-cyan-600 text-sm md:text-base">
                                    {new Date(movie?.releaseDate) <= new Date()
                                        ? `Released: ${movie?.releaseDate?.split("T")[0]}`
                                        : `Releasing on: ${movie?.releaseDate?.split("T")[0]}`}
                                </p>
                                <p className="text-cyan-600 text-sm md:text-base">
                                    {movie?.runtime} min
                                </p>
                            </div>

                            <div className="grid grid-flow-col auto-cols-max gap-4 mb-3">
                                <span className="text-sm md:text-base bg-gray-800 px-3 py-1 rounded-full">
                                    {movie.genre.name}
                                </span>
                            </div>
                        </div>
                    </div>

                    <p className="text-gray-300 mb-8 text-lg leading-relaxed">{movie.description}</p>
                    <div className="flex flex-wrap items-center gap-4">
                        {purchased && (
                            <button
                                onClick={() => window.open(movie.movieLink, "_blank")}
                                className="border bg-gray-300 text-black border-gray-300 py-3 px-6 flex flex-row items-center hover:bg-gray-400 rounded-md font-medium transition-colors"
                            >
                                <IoMdPlay className="mr-3" />
                                Movie Purchased
                            </button>
                        )}
                        {!purchased && (
                            <>
                                <button
                                    onClick={handlePurchase}
                                    disabled={isPurchasing}
                                    className={`border bg-yellow-500 text-black border-yellow-500 py-3 px-6 flex flex-row items-center rounded-md font-medium transition-colors ${isPurchasing ? 'opacity-60 cursor-not-allowed' : 'hover:bg-yellow-600'}`}
                                >
                                    <IoMdPlay className="mr-3" />
                                    Unlock to Watch — ${price}
                                </button>
                                {isPurchasing && <LoadingBar message="Unlocking..." />}
                            </>
                        )}
                        {movie.trailerLink && (
                            <button
                                onClick={() => setShowModal(true)}
                                className="border text-[#FFFDE3] text-base border-gray-300 py-3 px-6 flex flex-row items-center hover:bg-cyan-600 hover:border-cyan-600 rounded-md font-medium transition-colors"
                            >
                                <IoMdPlay className="mr-3" />
                                Watch Trailer
                            </button>
                        )}
                        {role && (
                            <button onClick={onFavClick} className="cursor-pointer p-2">
                                {movie.isFavourite ? (
                                    <FaHeart className="text-pink-300 text-3xl hover:text-pink-400 transition-colors" />
                                ) : (
                                    <FaRegHeart className="text-gray-300 text-3xl hover:text-pink-300 transition-colors" />
                                )}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieInfo;
