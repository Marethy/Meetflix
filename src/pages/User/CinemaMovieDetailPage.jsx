import React, { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlayIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
import { MovieContext } from "../../context/MovieDetailContext";
import CinemaMovieInfo from "../../components/movie/CinemaMovieInfo";
import MovieApi from "../../api/movieApi";

function CinemaMovieDetailPage() {
  const { handleVideoTrailer } = useContext(MovieContext);
  const navigate = useNavigate();
  const { id } = useParams();

  // Fetch movie details using React Query
  const {
    data: movie,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => MovieApi.getMovieById(id),
    staleTime: 5000,
    cacheTime: 10000,
  });

  // Loading state
  if (isLoading) {
    return <div className="text-center text-xl mt-10">Loading...</div>;
  }

  // Error state
  if (error) {
    return (
      <div className="text-center text-xl mt-10 text-red-500">
        Failed to load movie details. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto my-20 px-4">
      <div className="flex flex-col md:flex-row gap-8 mx-auto items-start ">
        {/* Movie Poster */}
        <div className="w-full md:w-1/3 flex-shrink-0">
          <img
            src={movie.urlImage} 
            alt={movie.name}
            className="ml-20 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
          />
        </div>

        {/* Movie Info */}
        <div className="w-full md:w-2/3 space-y-6">
          <CinemaMovieInfo movie={movie} />

          {/* Action Buttons */}
          <div className="flex gap-4 mt-6">
            <button
              className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-500 transition duration-300"
              onClick={() => handleVideoTrailer(movie.id)}
            >
              <VideoCameraIcon className="h-6 w-6 mr-2" /> Watch Trailer
            </button>
            <button
              className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500 transition duration-300"
              onClick={() => navigate("order")}
            >
              <PlayIcon className="h-6 w-6 mr-2" /> Order Ticket Now
            </button>
          </div>
        </div>
      </div>

      {/* Recommended Movies */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold mb-4">Recommended Movies</h3>
        {/* Logic to fetch and display recommended movies */}
      </div>
    </div>
  );
}

export default CinemaMovieDetailPage;
