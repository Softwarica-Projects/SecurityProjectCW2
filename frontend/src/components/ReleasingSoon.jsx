import React, { useState, useEffect } from "react";

import { useNavigate } from 'react-router-dom';
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { FiChevronsRight } from 'react-icons/fi';
import { getReleasingSoonMovies } from "../services/movieService";

import MovieRow from "./MovieRow";

const ReleasingSoon = () => {
  const [movies, setMovies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getReleasingSoonMovies().then((response) => {
      setMovies(response);
    });
  }, []);
  return (
    <MovieRow movies={movies} title="Releasing Soon" rowID={"3"} showRating={false}></MovieRow>

  );
};

export default ReleasingSoon;
