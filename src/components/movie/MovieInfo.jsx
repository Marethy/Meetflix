import React from 'react';
import PropTypes from 'prop-types';

const MovieInfo = ({ movie }) => {
  if (!movie) return <div>Loading...</div>;

  return (
    <div className="flex flex-col text-gray-200 space-y-4">
      <h1 className="text-4xl font-extrabold">{movie.title}</h1>
      <p className="text-gray-400"><strong>Overview:</strong> {movie.overview}</p>
      <p><strong>Release Date:</strong> {movie.release_date}</p>
      <p><strong>Duration:</strong> {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m</p>
      <p><strong>Genres:</strong> {movie.genres.map((genre) => genre.name).join(', ')}</p>
      <p><strong>Rating:</strong> {movie.vote_average} / 10</p>
    </div>
  );
};

MovieInfo.propTypes = {
  movie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    overview: PropTypes.string,
    release_date: PropTypes.string,
    runtime: PropTypes.number,
    genres: PropTypes.arrayOf(PropTypes.shape({
      name: PropTypes.string,
    })),
    vote_average: PropTypes.number,
    poster_path: PropTypes.any,
  }).isRequired,
};

export default MovieInfo;
