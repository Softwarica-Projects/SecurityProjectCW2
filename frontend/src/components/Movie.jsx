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
    <div className="relative inline-block cursor-pointer p-3">
      <div className="overflow-hidden rounded-lg shadow group" onClick={handleClick}>
        <img className="w-full h-72 object-cover group-hover:scale-105 transition-transform duration-300" src={getImageUrl(movie.coverImage)} alt={movie.title || "Movie poster"} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
          <div className="flex items-center justify-between">
            <div className="text-white font-semibold text-lg truncate">{movie.title}</div>
            <div className="text-white text-sm flex items-center gap-2">
              <AiFillStar className="text-yellow-400" />
              <span className="font-bold">{movie.averageRating?.toFixed(2) ?? '-'}</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {movie.isPurchased && <Tag color="bg-primary-600">Purchased</Tag>}
              <div className="text-sm text-white/80">{movie.genre?.name}</div>
            </div>
            <div>
              <button className="bg-primary-600 text-white px-3 py-1 rounded-md text-sm">Watch</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Movie;
