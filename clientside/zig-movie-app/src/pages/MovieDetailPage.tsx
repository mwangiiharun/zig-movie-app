import React, { useEffect, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Movie } from '../types';

const API_BASE = 'http://localhost:5000';

interface RouteParams {
  id: string;
}

type MovieDetailPageProps = RouteComponentProps<RouteParams>;

const MovieDetailPage: React.FC<MovieDetailPageProps> = ({ match }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const fetchMovie = async () => {
      const id = match.params.id;

      try {
        const response = await fetch(`${API_BASE}/api/movie/${id}`);
        if (!response.ok) {
          throw new Error('Unable to load movie details');
        }
        const data: Movie = await response.json();
        setMovie(data);
        setLoading(false);
      } catch (err) {
        setError((err as Error).message);
        setLoading(false);
      }
    };

    fetchMovie();
  }, [match.params.id]);

  if (loading) {
    return (
      <div className="container my-4">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-4">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-link">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="container my-4">
        <p>Movie not found.</p>
        <Link to="/" className="btn btn-link">
          &larr; Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="container my-4">
      <Link to="/" className="btn btn-link mb-3">
        &larr; Back to home
      </Link>

      <div className="row">
        <div className="col-md-4">
          {movie.posterImageUrl && (
            <img
              src={movie.posterImageUrl}
              alt={movie.title}
              className="img-fluid rounded mb-3"
            />
          )}
        </div>
        <div className="col-md-8">
          <h1 className="mb-3">
            {movie.homepage ? (
              <a href={movie.homepage} target="_blank" rel="noopener noreferrer">
                {movie.title}
              </a>
            ) : (
              movie.title
            )}
          </h1>
          <p className="lead">{movie.overview || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;

