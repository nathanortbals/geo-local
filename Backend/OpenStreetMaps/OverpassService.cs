using System.Text.Json;
using System.Text;
using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;

namespace GeoLocal.OpenStreetMaps
{
    public class OverpassService(HttpClient httpClient)
    {
        private readonly JsonSerializerOptions jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
        };

        public async Task<OverpassResponse> GetOverpassResponse(int id)
        {
            var url = "https://overpass-api.de/api/interpreter";
            var query = $"""
                [out:json];
                relation(id:{id})[type="boundary"];
                out geom;
                """;

            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(query, Encoding.UTF8, "text/plain"),
            };

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<OverpassResponse>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            return responseBody;
        }
    }
}
