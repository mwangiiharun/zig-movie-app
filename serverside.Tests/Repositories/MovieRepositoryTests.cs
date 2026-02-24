using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using serverside.Models;
using serverside.Repositories;
using serverside.Services;
using Xunit;

namespace serverside.Tests.Repositories
{
    public class MovieRepositoryTests
    {
        [Fact]
        public async Task GetPopularAsync_Returns_Top_Twenty()
        {
            // Arrange
            var movies = Enumerable.Range(1, 30)
                .Select(i => new MovieSummary { Id = i, Title = "Movie " + i })
                .ToList();

            var client = new FakeMovieApiClient(popular: new MovieListResponse { Results = movies });
            var repo = new MovieRepository(client);

            // Act
            var result = await repo.GetPopularAsync(20);

            // Assert
            Assert.Equal(20, result.Count);
        }

        [Fact]
        public async Task SearchByTitleAsync_Empty_Query_Returns_Empty_Without_Calling_Client()
        {
            // Arrange
            var client = new FakeMovieApiClient();
            var repo = new MovieRepository(client);

            // Act
            var result = await repo.SearchByTitleAsync("  ", 10);

            // Assert
            Assert.Empty(result);
            Assert.False(client.SearchWasCalled);
        }

        [Fact]
        public async Task GetByIdAsync_Forwards_To_Client()
        {
            // Arrange
            var movie = new MovieSummary { Id = 42, Title = "The Answer" };
            var client = new FakeMovieApiClient(singleMovie: movie);
            var repo = new MovieRepository(client);

            // Act
            var result = await repo.GetByIdAsync(42);

            // Assert
            Assert.Equal(42, result.Id);
            Assert.True(client.GetByIdWasCalled);
        }

        private class FakeMovieApiClient : IMovieApiClient
        {
            private readonly MovieListResponse _popular;
            private readonly MovieListResponse _searchResults;
            private readonly MovieSummary _singleMovie;

            public bool SearchWasCalled { get; private set; }
            public bool GetByIdWasCalled { get; private set; }

            public FakeMovieApiClient(
                MovieListResponse popular = null,
                MovieListResponse searchResults = null,
                MovieSummary singleMovie = null)
            {
                _popular = popular;
                _searchResults = searchResults;
                _singleMovie = singleMovie;
            }

            public Task<MovieListResponse> GetPopularAsync(int page = 1)
            {
                return Task.FromResult(_popular ?? new MovieListResponse { Results = new List<MovieSummary>() });
            }

            public Task<MovieListResponse> SearchAsync(string query)
            {
                SearchWasCalled = true;
                return Task.FromResult(_searchResults ?? new MovieListResponse { Results = new List<MovieSummary>() });
            }

            public Task<MovieSummary> GetByIdAsync(int id)
            {
                GetByIdWasCalled = true;
                return Task.FromResult(_singleMovie);
            }
        }
    }
}

