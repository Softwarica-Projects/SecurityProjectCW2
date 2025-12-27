import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { getPopularMovies } from "../services/movieService";

import MovieRow from "./MovieRow";

const LoadingBar = ({ message = '' }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center">
        <div className="w-14 h-14 border-4 border-gray-300 border-t-cyan-500 rounded-full animate-spin" />
        {message && <div className="mt-3 text-white text-sm">{message}</div>}
      </div>
    </div>
  );
};

export default LoadingBar;
