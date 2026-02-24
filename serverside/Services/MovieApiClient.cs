using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using serverside.Models;

namespace serverside.Services
{
    public interface IMovieApiClient
    {
        Task<MovieListResponse> GetPopularAsync(int page = 1);
        Task<MovieListResponse> SearchAsync(string query);
        Task<MovieSummary> GetByIdAsync(int id);
    }

    public class MovieApiClient : IMovieApiClient
    {
        private static readonly HttpClient _httpClient = new HttpClient
        {
            BaseAddress = new Uri("https://api.themoviedb.org/3/")
        };

        private readonly string _apiKey;

        public MovieApiClient(IConfiguration configuration)
        {
            _apiKey = configuration["API_KEY"];

            if (string.IsNullOrWhiteSpace(_apiKey))
            {
                throw new InvalidOperationException("API_KEY configuration value is missing. Please export API_KEY environment variable.");
            }
        }

        public async Task<MovieListResponse> GetPopularAsync(int page = 1)
        {
            var url = $"movie/popular?api_key={_apiKey}&page={page}";
            return await GetAsync<MovieListResponse>(url);
        }

        public async Task<MovieListResponse> SearchAsync(string query)
        {
            var encodedQuery = Uri.EscapeDataString(query ?? string.Empty);
            var url = $"search/movie?api_key={_apiKey}&query={encodedQuery}";
            return await GetAsync<MovieListResponse>(url);
        }

        public async Task<MovieSummary> GetByIdAsync(int id)
        {
            var url = $"movie/{id}?api_key={_apiKey}";
            return await GetAsync<MovieSummary>(url);
        }

        private static async Task<T> GetAsync<T>(string url)
        {
            var response = await _httpClient.GetAsync(url);
            response.EnsureSuccessStatusCode();

            var json = await response.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}

