// src/hooks/useFetchMovies.js
import { useEffect, useState } from "react";

const useFetchMovies = () => {
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      const urls = [
        "https://api.themoviedb.org/3/trending/movie/day?language=vi",
        "https://api.themoviedb.org/3/movie/top_rated?language=vi",
      ];
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_API_KEY}`,
        },
      };

      try {
        const fetchMovies = async (url) => {
          const response = await fetch(url, options);
          return await response.json();
        };

        const response = await Promise.all(urls.map(fetchMovies));
        setTrendingMovies(response[0].results);
        setTopRatedMovies(response[1].results);
        console.log(response[0].results);
      } catch (error) {
        
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, []);

  return { trendingMovies, topRatedMovies, isLoading };
};

export default useFetchMovies;
