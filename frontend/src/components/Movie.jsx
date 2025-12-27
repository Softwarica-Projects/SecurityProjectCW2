import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AiFillStar } from 'react-icons/ai';
import { getImageUrl } from '../utils/imageUtils';
import Tag from "./Tag";


const Movie = ({ movie, showRating = true }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/movies/${movie._id}`)
  }
  return (
    <div className="w-[180px] sm:w-[250px] md:w-[320px] lg:w-[320px] xl:w-[280px] h-[270px] sm:h-[375px] md:h-[480px] lg:h-[480px] xl:h-[420px] inline-block cursor-pointer relative p-4 z-0">
      <img
        className="w-full h-full hover:opacity-50 rounded object-cover"
        src={getImageUrl(movie.coverImage)}
        alt={movie.title || "Movie poster"}
        onClick={handleClick}
      />
      <div onClick={handleClick} className="absolute top-0 left-0 w-full h-full bg-black/40 hover:opacity-100 text-white px-5">
        {movie.isPurchased && (<div className="absolute top-8 left-8"><Tag color="bg-indigo-600">Purchased</Tag></div>)}
        <div className="absolute top-8 right-8">
          {showRating ? (
            <div className="flex flex-row justify-center items-center text-orange-400">
              <AiFillStar />
              <p className="text-xs md:text-base font-bold">{movie.averageRating?.toFixed(2)} </p>
            </div>
          ) : (
            <div className="primary-chip px-2 py-1 rounded-full">
              <p className="text-xs md:text-sm font-medium text-white">
                {new Date(movie.releaseDate).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                }).replace(/\//g, ' ').replace(/(\d{2}) (\d{2}) (\d{4})/, '$1 $2, $3')}
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-row justify-center items-center absolute bottom-8 left-8 right-8">
          <p className="text-base md:text-lg font-medium truncate">{movie.title}</p>
        </div>
      </div>
    </div>
  );
};

export default Movie;
