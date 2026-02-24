using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using serverside.Controllers;
using serverside.Models;
using serverside.Repositories;
using Xunit;

namespace serverside.Tests.Controllers
{
    public class MoviesControllerTests
    {
        [Fact]
        public async Task GetPopular_Returns_Ok_With_List()
        {
            // Arrange
            var movies = new List<MovieSummary>
            {
                new MovieSummary { Id = 1, Title = "Test Movie 1" },
                new MovieSummary { Id = 2, Title = "Test Movie 2" }
            };
            var repo = new FakeMovieRepository(popular: movies);
            var controller = new MoviesController(repo);

            // Act
            var result = await controller.GetPopular();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<MovieSummary>>(okResult.Value);
            Assert.NotEmpty(returned);
        }

        [Fact]
        public async Task Search_Returns_Ok_With_Results()
        {
            // Arrange
            var movies = new List<MovieSummary>
            {
                new MovieSummary { Id = 3, Title = "Bird Box" }
            };
            var repo = new FakeMovieRepository(searchResults: movies);
            var controller = new MoviesController(repo);

            // Act
            var result = await controller.Search("bird");

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsAssignableFrom<IEnumerable<MovieSummary>>(okResult.Value);
            Assert.Single(returned);
        }

        [Fact]
        public async Task GetMovie_Returns_Ok_When_Found()
        {
            // Arrange
            var movie = new MovieSummary { Id = 10, Title = "Some Movie" };
            var repo = new FakeMovieRepository(singleMovie: movie);
            var controller = new MoviesController(repo);

            // Act
            var result = await controller.GetMovie(10);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returned = Assert.IsType<MovieSummary>(okResult.Value);
            Assert.Equal(10, returned.Id);
        }

        [Fact]
        public async Task GetMovie_Returns_NotFound_When_Missing()
        {
            // Arrange
            var repo = new FakeMovieRepository(singleMovie: null);
            var controller = new MoviesController(repo);

            // Act
            var result = await controller.GetMovie(99);

            // Assert
            Assert.IsType<NotFoundResult>(result.Result);
        }

        private class FakeMovieRepository : IMovieRepository
        {
            private readonly IReadOnlyList<MovieSummary> _popular;
            private readonly IReadOnlyList<MovieSummary> _searchResults;
            private readonly MovieSummary _singleMovie;

            public FakeMovieRepository(
                IReadOnlyList<MovieSummary> popular = null,
                IReadOnlyList<MovieSummary> searchResults = null,
                MovieSummary singleMovie = null)
            {
                _popular = popular ?? new List<MovieSummary>();
                _searchResults = searchResults ?? new List<MovieSummary>();
                _singleMovie = singleMovie;
            }

            public Task<IReadOnlyList<MovieSummary>> GetPopularAsync(int take = 20, int page = 1)
            {
                return Task.FromResult(_popular);
            }

            public Task<IReadOnlyList<MovieSummary>> SearchByTitleAsync(string query, int take = 20)
            {
                return Task.FromResult(_searchResults);
            }

            public Task<MovieSummary> GetByIdAsync(int id)
            {
                return Task.FromResult(_singleMovie);
            }
        }
    }
}

