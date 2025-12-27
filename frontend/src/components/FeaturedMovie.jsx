import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { getFeaturedMovies } from "../services/movieService";
import MovieTrailer from "../components/MovieTrailer";
import { getImageUrl } from '../utils/imageUtils';
const FeaturedMovie = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const movie = movies[currentIndex];
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    getFeaturedMovies().then((response) => {
      setMovies(response);
    });
  }, []);

  useEffect(() => {
    if (movies.length > 1) {
      const interval = setInterval(() => {
        setFadeClass('opacity-0');
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
          setFadeClass('opacity-100');
        }, 500);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [movies.length]);

  const navigate = useNavigate();

  const ReadMore = (text) => {
    const over = JSON.stringify(text);
    const overview = over.replace(/[^\w\s]/g, "").replace(/(^\s+|\s+$)/g, "").replace(/\s+/g, " ").replace("children", "");
    const [isReadMore, setIsReadMore] = useState(true);
    const toggleReadMore = () => { setIsReadMore(!isReadMore) };

    return (
      <p>
        {isReadMore ? overview.slice(0, 150) : overview}
        {overview.length > 150 &&
          <span onClick={toggleReadMore} className="text-gray-500 cursor-pointer">
            {isReadMore ? '...read more' : ' ...show less'}
          </span>
        }
      </p>
    )
  }

  const handleClick = () => {
    navigate(`movies/${movie._id}`)
  }

  return (
    <>
      {showModal ? (
        <MovieTrailer trailerLink={movie.trailerLink} onClick={() => setShowModal(false)}>
        </MovieTrailer>
      ) : null}
      <div className="w-full h-[50vh] md:h-[500px] text-[#FFFDE3]">
        <div className={`w-full h-full transition-opacity duration-500 ${fadeClass}`}>
          <div className="absolute w-full h-[50vh] md:h-[500px] bg-gradient-to-r from-black">
            {" "}
          </div>
          <img
            className="w-full h-[70vh] md:h-full object-cover"
            src={getImageUrl(movie?.coverImage)}
            alt={movie?.title || "Featured movie"}
          />
          <div className="absolute w-full top-[30%] p-4 md:p-16">
            <h1 className="text-2xl md:text-5xl font-bold">{movie?.title} </h1>
            <div className="my-4">
              <button onClick={handleClick} className=" border bg-gray-300 text-black border-gray-300 py-2 px-5" >
                More Detail
              </button>
              <button className="border text-[#FFFDE3] border-gray-300 py-2 px-5 ml-4 " onClick={() => {
              setShowModal(true)
              }}>
                Trailer
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              Released On: {movie?.releaseDate?.split("T")[0]}{" "}
            </p>

            <p className="w-full sm:max-w-[80%] md:max-w-[70%] lg:max-w-[50%] text-gray-200 text-sm md:text-base mt-2">
              <ReadMore>
                {movie?.description}
              </ReadMore>
            </p>
            {movies.length > 1 && (
              <div className="flex space-x-2 mt-4">
                {movies.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-colors duration-300 ${index === currentIndex ? 'bg-white' : 'bg-gray-500'
                      }`}
                    onClick={() => {
                      setFadeClass('opacity-0');
                      setTimeout(() => {
                        setCurrentIndex(index);
                        setFadeClass('opacity-100');
                      }, 500);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FeaturedMovie;
