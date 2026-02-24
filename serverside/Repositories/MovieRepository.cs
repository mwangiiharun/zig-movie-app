using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using serverside.Models;
using serverside.Services;

namespace serverside.Repositories
{
    public interface IMovieRepository
    {
        Task<IReadOnlyList<MovieSummary>> GetPopularAsync(int take = 20, int page = 1);
        Task<IReadOnlyList<MovieSummary>> SearchByTitleAsync(string query, int take = 20);
        Task<MovieSummary> GetByIdAsync(int id);
    }

    public class MovieRepository : IMovieRepository
    {
        private readonly IMovieApiClient _client;

        public MovieRepository(IMovieApiClient client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client));
        }

        public async Task<IReadOnlyList<MovieSummary>> GetPopularAsync(int take = 20, int page = 1)
        {
            var list = await _client.GetPopularAsync(page);
            return list?.Results?
                       .OrderByDescending(m => m.Id)
                       .Take(take)
                       .ToList()
                   ?? new List<MovieSummary>();
        }

        public async Task<IReadOnlyList<MovieSummary>> SearchByTitleAsync(string query, int take = 20)
        {
            if (string.IsNullOrWhiteSpace(query))
            {
                return new List<MovieSummary>();
            }

            var list = await _client.SearchAsync(query);

            return list?.Results?
                       .Where(m => !string.IsNullOrWhiteSpace(m.Title))
                       .Take(take)
                       .ToList()
                   ?? new List<MovieSummary>();
        }

        public Task<MovieSummary> GetByIdAsync(int id)
        {
            return _client.GetByIdAsync(id);
        }
    }
}

