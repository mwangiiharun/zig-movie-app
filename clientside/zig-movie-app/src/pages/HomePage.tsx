import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import { Movie } from '../types';

const API_BASE = 'http://localhost:5000';

const HomePage: React.FC = () => {
  const [popular, setPopular] = useState<Movie[]>([]);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [popularPage, setPopularPage] = useState<number>(1);
  const [popularHasMore, setPopularHasMore] = useState<boolean>(true);
  const [error, setError] = useState<string | undefined>(undefined);

  const fetchPopular = async (page: number, append: boolean) => {
    try {
      if (append) {
        setLoadingMore(true);
        setError(undefined);
      } else {
        setLoading(true);
        setError(undefined);
      }

      const response = await fetch(`${API_BASE}/api/popular?page=${page}`);
      if (!response.ok) {
        throw new Error('Unable to load popular movies');
      }
      const data: Movie[] = await response.json();

      setPopular(prevPopular => {
        const existingIds = new Set(prevPopular.map(m => m.id));
        const newItems = append
          ? data.filter(m => !existingIds.has(m.id))
          : data;

        return append ? prevPopular.concat(newItems) : newItems;
      });

      setPopularPage(page);
      setPopularHasMore(data.length === 20);
      setLoading(false);
      setLoadingMore(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchPopular(1, false);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (loading || loadingMore || !popularHasMore) {
        return;
      }

      // Only infinite-scroll the popular list when not viewing search results
      if (searchResults.length > 0 || query.trim().length > 0) {
        return;
      }

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 200;

      if (scrollPosition >= threshold) {
        const nextPage = popularPage + 1;
        fetchPopular(nextPage, true);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [loading, loadingMore, popularHasMore, searchResults, query, popularPage]);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      setError(undefined);
      const response = await fetch(
        `${API_BASE}/api/search?query=${encodeURIComponent(query.trim())}`,
      );
      if (!response.ok) {
        throw new Error('Unable to search movies');
      }
      const data: Movie[] = await response.json();
      setSearchResults(data);
      setLoading(false);
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="container my-4">
      <h1 className="mb-4">Popular Movies</h1>

      <form className="form-inline mb-4" onSubmit={onSearchSubmit}>
        <input
          type="text"
          className="form-control mr-2 flex-grow-1"
          placeholder="Search for a movie by title..."
          value={query}
          onChange={onQueryChange}
        />
        <button className="btn btn-outline-primary" type="submit" disabled={loading}>
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      {searchResults.length > 0 && (
        <MovieList movies={searchResults} title="Search Results" />
      )}

      <MovieList movies={popular} title="Popular Movies" />

      <div className="text-center my-3">
        {loadingMore && <span>Loading more...</span>}
        {!loadingMore && !loading && !searchResults.length && !popularHasMore && (
          <span>No more movies to load.</span>
        )}
      </div>
    </div>
  );
};

export default HomePage;

