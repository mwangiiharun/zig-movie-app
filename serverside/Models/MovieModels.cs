using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace serverside.Models
{
    public class MovieSummary
    {
        [JsonProperty("id")]
        public int Id { get; set; }

        [JsonProperty("title")]
        public string Title { get; set; }

        [JsonProperty("overview")]
        public string Overview { get; set; }

        [JsonProperty("poster_path")]
        public string PosterPath { get; set; }

        // This will be populated only when requesting a single movie
        [JsonProperty("homepage")]
        public string Homepage { get; set; }

        public string PosterImageUrl =>
            string.IsNullOrEmpty(PosterPath)
                ? null
                : $"https://image.tmdb.org/t/p/w500{PosterPath}";
    }

    public class MovieListResponse
    {
        [JsonProperty("results")]
        public List<MovieSummary> Results { get; set; }
    }
}

