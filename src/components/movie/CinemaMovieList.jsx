import React, { useState } from "react";
import { Button, Modal, Typography, Spin } from "antd";
import { useQuery } from "@tanstack/react-query";
import MovieApi from "../../api/movieApi";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { useNavigate } from "react-router-dom";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StyleIcon from "@mui/icons-material/Style";
import PublicIcon from "@mui/icons-material/Public";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import PersonOffIcon from "@mui/icons-material/PersonOff";

const { Text } = Typography;

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
    items: 2,
  },
};

const CinemaMovieList = () => {
  const navigate = useNavigate();

  // const [isModalVisible, setIsModalVisible] = useState(false);
  // const [selectedMovie, setSelectedMovie] = useState(null);

  const { data: movies, isLoading } = useQuery({
    queryKey: ["movies"],
    queryFn: MovieApi.getMovies,
  });

  // const showModal = (movie) => {
  //   setSelectedMovie(movie);
  //   setIsModalVisible(true);
  // };

  // const handleModalClose = () => {
  //   setIsModalVisible(false);
  //   setSelectedMovie(null);
  // };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spin tip="Loading movies..." />
      </div>
    );
  }

  return (
    <div className="my-10 px-2 md:px-10 max-w-full relative">
      <h2 className="text-3xl font-bold text-[#777] self-start flex w-full mb-4">
        {" "}
        PHIM ĐANG CHIẾU{" "}
      </h2>
      <Carousel responsive={responsive} draggable={false}>
        {movies?.content.map((movie) => (
          <div
            key={movie.id}
            className="slide-item relative flex-shrink-0 w-[180px] h-[270px] rounded-md overflow-hidden"
            onClick={() => navigate(`/user/cinema_movies/${movie.id}`)}
          >
            <img
              className="absolute slide-item-poster w-[180px] h-[270px] object-cover rounded-md z-[9]"
              src={movie.urlImage}
              alt={`${name} poster`}
            />
            <div className="absolute slide-item-filter w-[240px] h-[360px] bg-black z-10" />
            <div className="absolute slide-item-info w-full h-[170px] z-[11]">
              <div className="text-white flex flex-col py-3 px-[6px]">
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
                <div className="text-xs pl-2 flex flex-col items-start font-normal space-y-2">
                  <div className="overflow-ellipsis truncate">
                    <PersonOffIcon sx={{ fontSize: 13, color: "#ebd113" }} /> T
                    {movie.director.map((d) => d.name).join(", ")}
                  </div>
                  <div className="overflow-ellipsis truncate">
                    <StyleIcon sx={{ fontSize: 13, color: "#ebd113" }} />{" "}
                    {movie.categories.map((c) => c.name).join(", ")}
                  </div>
                  <div className="overflow-ellipsis truncate">
                    <AccessTimeIcon sx={{ fontSize: 13, color: "#ebd113" }} />{" "}
                    {Math.floor(movie.durationMin / 60)}h{" "}
                    {movie.durationMin % 60}m
                  </div>
                  <div className="overflow-ellipsis truncate">
                    <PublicIcon sx={{ fontSize: 13, color: "#ebd113" }} />{" "}
                    {movie.country}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>

      {/* <Modal
        title={selectedMovie?.name || 'Movie Details'}
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
      >
        {selectedMovie && (
          <div>
            <Text strong>Description: </Text>
            <p>{selectedMovie.description}</p>
            <Text strong>Release Date: </Text>
            <p>{selectedMovie.releaseDate}</p>
            <Text strong>Duration: </Text>
            <p>{selectedMovie.durationMin} minutes</p>
            <Text strong>Director: </Text>
            <p>{selectedMovie.director.map(d => d.name).join(', ')}</p>
            <Text strong>Categories: </Text>
            <p>{selectedMovie.categories.map(c => c.name).join(', ')}</p>
            <Button onClick={() => handleModalClose()} type="primary">
              Close
            </Button>
          </div>
        )}
      </Modal> */}
    </div>
  );
};

export default CinemaMovieList;
