using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using serverside.Models;
using serverside.Repositories;

namespace serverside.Controllers
{
    [Route("api")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly IMovieRepository _repository;

        public MoviesController(IMovieRepository repository)
        {
            _repository = repository;
        }

        // GET: api/popular
        [HttpGet("popular")]
        public async Task<ActionResult<IEnumerable<MovieSummary>>> GetPopular([FromQuery] int page = 1)
        {
            var movies = await _repository.GetPopularAsync(20, page);
            return Ok(movies);
        }

        // GET: api/search?query=birdbox
        [HttpGet("search")]
        public async Task<ActionResult<IEnumerable<MovieSummary>>> Search([FromQuery] string query)
        {
            var movies = await _repository.SearchByTitleAsync(query, 20);
            return Ok(movies);
        }

        // GET: api/movie/1145
        [HttpGet("movie/{id}")]
        public async Task<ActionResult<MovieSummary>> GetMovie(int id)
        {
            var movie = await _repository.GetByIdAsync(id);

            if (movie == null)
            {
                return NotFound();
            }

            return Ok(movie);
        }
    }
}

