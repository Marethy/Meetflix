  import React, { useEffect, useState, useContext } from "react";
  import { useParams, useNavigate } from "react-router-dom";
  import axios from "axios";
  import useFetchMovies from "../../hooks/useFetchMovies";
  import { PlayIcon, VideoCameraIcon } from "@heroicons/react/24/solid";
  import { MovieContext } from "../../context/MovieDetailContext";
  import MovieInfo from "../../components/movie/MovieInfo";

  function MovieDetailPage() {
    const { handleVideoTrailer } = useContext(MovieContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [error, setError] = useState(null);
    const { topRatedMovies } = useFetchMovies();

    useEffect(() => {
      const fetchMovie = async () => {
        try {
          const response = await axios.get(
            `https://api.themoviedb.org/3/movie/${id}`,
            {
              headers: {
                accept: "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
              },
            }
          );
          setMovie(response.data);
        } catch (err) {
          setError("Failed to load movie details. Please try again.");
        }
      };

      fetchMovie();
    }, [id]);

    if (error) {
      return <div className="text-center text-xl mt-10 text-red-500">{error}</div>;
    }

    if (!movie) {
      return <div className="text-center text-xl mt-10">Loading...</div>;
    }

    return (
      <div className="container mx-auto my-20 px-4">
        <div className="flex flex-col md:flex-row gap-8 mx-auto items-start">
          {/* Movie Poster */}
          <div className="w-full md:w-1/3 flex-shrink-0">
            <img
              src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
              alt={movie.title}
              className="ml-20 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </div>

          {/* Movie Info */}
          <div className="w-full md:w-2/3 space-y-6">
            <MovieInfo movie={movie} />
            
            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                className="flex items-center bg-red-600 text-white py-2 px-4 rounded-lg shadow hover:bg-red-500 transition duration-300"
                onClick={() => handleVideoTrailer(movie.id)}
              >
                <VideoCameraIcon className="h-6 w-6 mr-2" /> Watch Trailer
              </button>
              <button className="flex items-center bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-500 transition duration-300">
                <PlayIcon className="h-6 w-6 mr-2" /> Order Ticket Now
              </button>
            </div>
          </div>
        </div>

        {/* Recommended Movies */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-4">Recommended Movies</h3>
          <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
            {topRatedMovies.slice(0, 7).map((recommendedMovie) => (
              <div key={recommendedMovie.id} className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={`https://image.tmdb.org/t/p/w200${recommendedMovie.poster_path}`}
                  alt={recommendedMovie.title}
                  className="w-full h-auto hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer"
                  onClick={() => navigate(`/user/movies/${recommendedMovie.id}`)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

export default MovieDetailPage