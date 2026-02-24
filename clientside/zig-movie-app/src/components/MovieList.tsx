import React from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';

interface MovieListProps {
  movies: Movie[];
  title: string;
}

const MovieList: React.FC<MovieListProps> = ({ movies, title }: MovieListProps) => {
  if (!movies || movies.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <h2 className="mb-3">{title}</h2>
      <div className="row">
        {movies.map((movie: Movie) => (
          <div key={movie.id} className="col-md-3 mb-4">
            <div className="card h-100">
              {movie.posterImageUrl && (
                <img
                  src={movie.posterImageUrl}
                  className="card-img-top"
                  alt={movie.title}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5 className="card-title">
                  <Link to={`/movie/${movie.id}`}>{movie.title}</Link>
                </h5>
                <p className="card-text text-muted">
                  {movie.overview
                    ? movie.overview.substring(0, 80) + '...'
                    : 'No description available.'}
                </p>
                <Link
                  to={`/movie/${movie.id}`}
                  className="btn btn-primary mt-auto align-self-start"
                >
                  View details
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;

