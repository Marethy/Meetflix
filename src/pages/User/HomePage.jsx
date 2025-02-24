import React from "react";
import Banner from "../../components/Banner";
import MovieList from "../../components/movie/MovieList";
import MovieSearch from "../../components/movie/MovieSearch";
import useFetchMovies from "../../hooks/useFetchMovies";
import CinemaMovieList from "../../components/movie/CinemaMovieList";
const HomePage = ({ searchData }) => {
  const { trendingMovies, topRatedMovies, isLoading } = useFetchMovies();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Banner />
      <div className="container mx-auto px-4 py-8 text-white">
        {searchData.length > 0 ? (
          <MovieSearch title="Kết quả tìm kiếm" data={searchData} />
        ) : (
          <>
            <h1 className="text-white text-5xl text-center font-bold font-sans tracking-wider">
              {" "}
              <p className=" text-white text-5xl -mt-8 mb-32 text-center font-bold font-sans tracking-wider">
                ĐẶT VÉ XEM PHIM
              </p>
              <CinemaMovieList />
              <p className="my-32">XEM TRỰC TIẾP TRÊN KHO PHIM{" "}</p>
            </h1>

            <MovieList
              title="PHIM ĐANG HOT"
              data={trendingMovies.slice(0, 10)}
            />
            <MovieList
              title="PHIM HAY NHẤT"
              data={topRatedMovies.slice(0, 10)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default HomePage;
