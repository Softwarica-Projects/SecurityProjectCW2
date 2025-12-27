import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { getPopularMovies } from "../services/movieService";

import MovieRow from "./MovieRow";

const PopularMovies = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getPopularMovies().then((response) => {
      setMovies(response);
    });
  }, []);
  return (
    <MovieRow movies={movies} title="Popular Movies" rowID={"1"}></MovieRow>

  );
};

export default PopularMovies;
