import React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Movie } from '../types';

const API_BASE = 'http://localhost:5000';

interface RouteParams {
  id: string;
}

interface MovieDetailState {
  movie?: Movie;
  loading: boolean;
  error?: string;
}

class MovieDetailPage extends React.Component<RouteComponentProps<RouteParams>, MovieDetailState> {
  public state: MovieDetailState = {
    loading: true,
  };

  public componentDidMount() {
    this.fetchMovie();
  }

  public render() {
    const { movie, loading, error } = this.state;

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
  }

  private fetchMovie = async () => {
    const { match } = this.props;
    const id = match.params.id;

    try {
      const response = await fetch(`${API_BASE}/api/movie/${id}`);
      if (!response.ok) {
        throw new Error('Unable to load movie details');
      }
      const data: Movie = await response.json();
      this.setState({ movie: data, loading: false });
    } catch (err) {
      this.setState({ error: (err as Error).message, loading: false });
    }
  };
}

export default MovieDetailPage;

