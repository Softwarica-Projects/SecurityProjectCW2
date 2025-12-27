
import { MdChevronLeft, MdChevronRight } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import Movie from "./Movie";

const MovieRow = ({ title, movies, rowID, showRating = true }) => {
  const navigate = useNavigate();
  const slideLeft = () => {
    var slider = document.getElementById('slider' + rowID);
    slider.scrollLeft = slider.scrollLeft - 500;
  };
  const slideRight = () => {
    var slider = document.getElementById('slider' + rowID);
    slider.scrollLeft = slider.scrollLeft + 500;
  };
  // movies prop
  if (!Array.isArray(movies) || movies.length === 0) return null;

  return (
      <div>
        <div className="flex flex-row items-center">
          <h2 className="text-[#FFFDE3] font-bold md:text-xl p-4 cursor-pointer">{title}</h2>
        </div>
        <div className="relative flex items-center ml-2 group">
          <MdChevronLeft
            className='bg-white rounded-full left-0 absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
            size={30}
            onClick={slideLeft}
          />
          <div id={'slider' + rowID} className='w-full h-full overflow-x-scroll whitespace-nowrap scroll-smooth scrollbar-hide relative break-words'>
            {movies.map((item, index) => {
              return (
                <Movie key={title + `_${index}`} movie={item} showRating={showRating}></Movie>
              );
            })}
          </div>
          <MdChevronRight
            className='bg-white rounded-full right-0 absolute opacity-50 hover:opacity-100 cursor-pointer z-10 hidden group-hover:block'
            size={30}
            onClick={slideRight}
          />
        </div>
      </div>
  );
};

export default MovieRow;
