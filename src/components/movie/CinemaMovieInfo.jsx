import React from 'react';
import PropTypes from 'prop-types';

const CinemaMovieInfo = ({ movie }) => {
  if (!movie) return <div>Loading...</div>;

  return (
    <div className="flex flex-col text-gray-200 space-y-4">
      <h1 className="text-4xl font-extrabold">{movie.name}</h1>
      <p className="text-gray-400"><strong>Overview:</strong> {movie.description}</p>
      <p><strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}</p>
      <p><strong>Duration:</strong> {Math.floor(movie.durationMin / 60)}h {movie.durationMin % 60}m</p>
      <p><strong>Country:</strong> {movie.country}</p>
      <p><strong>Director:</strong> {movie.director.map(d => d.name).join(', ')}</p>
      <p><strong>Actors:</strong> {movie.actors.length > 0 ? movie.actors.map(a => a.name).join(', ') : 'N/A'}</p>
      <p><strong>Categories:</strong> {movie.categories.map(c => c.name).join(', ')}</p>
      <p><strong>Star:{movie.rating_points} </strong></p>
    </div>
  );
};

CinemaMovieInfo.propTypes = {
  movie: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    country: PropTypes.string,
    releaseDate: PropTypes.string,
    durationMin: PropTypes.number,
    rating_points: PropTypes.number,
    director: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    actors: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
    urlImage: PropTypes.string.isRequired,
    categories: PropTypes.arrayOf(PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
    })),
  }).isRequired,

};

export default CinemaMovieInfo;
