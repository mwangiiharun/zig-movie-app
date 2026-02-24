import React from 'react';
import MovieList from '../components/MovieList';
import { Movie } from '../types';

const API_BASE = 'http://localhost:5000';

interface HomePageState {
  popular: Movie[];
  searchResults: Movie[];
  query: string;
  loading: boolean;
  loadingMore: boolean;
  popularPage: number;
  popularHasMore: boolean;
  error?: string;
}

class HomePage extends React.Component<{}, HomePageState> {
  public state: HomePageState = {
    popular: [],
    searchResults: [],
    query: '',
    loading: false,
    loadingMore: false,
    popularPage: 1,
    popularHasMore: true,
  };

  public componentDidMount() {
    this.fetchPopular(1, false);
    window.addEventListener('scroll', this.handleScroll);
  }

  public componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  public render() {
    const {
      popular,
      searchResults,
      query,
      loading,
      loadingMore,
      popularHasMore,
      error,
    } = this.state;

    return (
      <div className="container my-4">
        <h1 className="mb-4">Popular Movies</h1>

        <form className="form-inline mb-4" onSubmit={this.onSearchSubmit}>
          <input
            type="text"
            className="form-control mr-2 flex-grow-1"
            placeholder="Search for a movie by title..."
            value={query}
            onChange={this.onQueryChange}
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
  }

  private fetchPopular = async (page: number, append: boolean) => {
    try {
      if (append) {
        this.setState({ loadingMore: true, error: undefined });
      } else {
        this.setState({ loading: true, error: undefined });
      }

      const response = await fetch(`${API_BASE}/api/popular?page=${page}`);
      if (!response.ok) {
        throw new Error('Unable to load popular movies');
      }
      const data: Movie[] = await response.json();
      this.setState(prevState => {
        const existingIds = new Set(prevState.popular.map(m => m.id));
        const newItems = append
          ? data.filter(m => !existingIds.has(m.id))
          : data;

        return {
          popular: append ? prevState.popular.concat(newItems) : newItems,
          loading: false,
          loadingMore: false,
          popularPage: page,
          popularHasMore: data.length === 20 && newItems.length > 0,
        };
      });
    } catch (err) {
      this.setState({
        error: (err as Error).message,
        loading: false,
        loadingMore: false,
      });
    }
  };

  private handleScroll = () => {
    const { loading, loadingMore, popularHasMore, searchResults, query, popularPage } =
      this.state;

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
      this.fetchPopular(nextPage, true);
    }
  };

  private onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ query: event.target.value });
  };

  private onSearchSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const { query } = this.state;

    if (!query.trim()) {
      this.setState({ searchResults: [] });
      return;
    }

    try {
      this.setState({ loading: true, error: undefined });
      const response = await fetch(
        `${API_BASE}/api/search?query=${encodeURIComponent(query.trim())}`,
      );
      if (!response.ok) {
        throw new Error('Unable to search movies');
      }
      const data: Movie[] = await response.json();
      this.setState({ searchResults: data, loading: false });
    } catch (err) {
      this.setState({ error: (err as Error).message, loading: false });
    }
  };
}

export default HomePage;

