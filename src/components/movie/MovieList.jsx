import PropTypes from "prop-types";
import { useContext } from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { MovieContext } from "../../context/MovieDetailContext";
import { useNavigate } from "react-router-dom";
import Modal from "react-modal";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PublicIcon from "@mui/icons-material/Public";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
const responsive = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 10,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1200 },
    items: 7,
  },
  tablet: {
    breakpoint: { max: 1200, min: 600 },
    items: 3,
  },
  mobile: {
    breakpoint: { max: 600, min: 0 },
    items: 3,
  },
};

const MovieList = ({ title, data }) => {
  const navigate = useNavigate();

  return (
    <div className="my-10 px-2 md:px-10 max-w-full">
      <h2 className="text-3xl font-bold text-[#777] md:text-3xl mb-10">{title}</h2>
      <Carousel responsive={responsive} draggable={false}>
      {data?.map((movie) => (
          <div
            key={movie.id}
            className="slide-item relative flex-shrink-0 w-[180px] h-[270px] rounded-md overflow-hidden"
            onClick={() => navigate(`/user/movies/${movie.id}`)}
          >
            <img
              className="absolute slide-item-poster w-[180px] h-[270px] object-cover rounded-md z-[9]"
              src={`${import.meta.env.VITE_IMG_URL}${movie.poster_path}`}
              alt={`${movie.name || movie.title || 'Movie'} poster`}
            />
            <div className="absolute slide-item-filter w-[180px] h-[270px] bg-black z-10 opacity-50" />
            <div className="absolute slide-item-info w-full h-[170px] z-[11]">
              <div className="text-white flex flex-col font-bold py-3 px-[6px]">
              <div
                  className="text-[17px] flex self-center justify-self-center place-self-center h-[70px]"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    lineHeight: 1.25,
                  }}
                >
                  {movie.name || movie.title || movie.original_title}
                </div>
                <div className="text-xs pl-2 flex flex-col font-normal items-start space-y-2">
                  <div className="overflow-ellipsis truncate">
                    <CalendarTodayIcon sx={{ fontSize: 13, color: "#ebd113" }} />{" "}
                    {movie.release_date}
                  </div>
                  <div className="overflow-ellipsis truncate">
                    <PublicIcon sx={{ fontSize: 13, color: "#ebd113" }} />{" "}
                    {movie.original_language}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

MovieList.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array,
};

export default MovieList;
