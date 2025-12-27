import { useEffect, useState } from "react";

import { useNavigate } from 'react-router-dom';
import { getRecentlyAdded } from "../services/movieService";

import MovieRow from "./MovieRow";

const RecentlyAdded = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getRecentlyAdded().then((response) => {
      setMovies(response);
    });
  }, []);
  return (
    <MovieRow movies={movies} title="Recently Added" rowID={"2"}></MovieRow>

  );
};

export default RecentlyAdded;
