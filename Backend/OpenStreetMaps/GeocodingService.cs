using System.Text.Json;

namespace GeoLocal.OpenStreetMaps
{
    public class GeocodingService(HttpClient httpClient)
    {
        private readonly JsonSerializerOptions jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
        };

        public async Task<IEnumerable<GeocodingResult>> GetGeocodingResults(string city)
        {
            var url = $"https://nominatim.openstreetmap.org/search?city={city}&format=json&limit=10&addressdetails=1&featureType=city";

            var request = new HttpRequestMessage(HttpMethod.Get, url);

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<IEnumerable<GeocodingResult>>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            var results = responseBody.Where(r => r.Class == "boundary" && r.OsmType == "relation").Take(5);

            return results;
        }
    }
}
