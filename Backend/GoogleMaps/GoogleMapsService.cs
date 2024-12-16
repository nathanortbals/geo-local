using System.Text;
using System.Text.Json;

namespace GeoLocal.GoogleMaps
{
    public class GoogleMapsService(HttpClient httpClient, string apiKey)
    {
        private readonly JsonSerializerOptions jsonSerializerOptions = new()
        {
            PropertyNameCaseInsensitive = true,
        };

        public async Task<GoogleMapsAutoCompleteResponse> FindPlaces(string search)
        {
            var url = $"https://places.googleapis.com/v1/places:autocomplete?key={apiKey}";
            var body = new
            {
                input = search,
                includedPrimaryTypes = "political",
            };
            var request = new HttpRequestMessage(HttpMethod.Post, url)
            {
                Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json")
            };
            request.Headers.Add("X-Goog-FieldMask", "suggestions.placePrediction.text.text,suggestions.placePrediction.placeId");

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<GoogleMapsAutoCompleteResponse>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            return responseBody;
        }

        public async Task<GoogleMapsPlaceResponse> GetPlace(string placeId)
        {
            var url = $"https://places.googleapis.com/v1/places/{placeId}?key={apiKey}";
            var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Add("X-Goog-FieldMask", "formattedAddress,viewport,location");

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<GoogleMapsPlaceResponse>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            return responseBody;
        }

        public async Task<GoogleMapsGeocodingResponse> ReverseGeocode(double latitude, double longitude)
        {
            var url = $"https://maps.googleapis.com/maps/api/geocode/json?latlng={latitude},{longitude}&key={apiKey}&result_type=route";
            var request = new HttpRequestMessage(HttpMethod.Get, url);

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<GoogleMapsGeocodingResponse>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            return responseBody;
        }

        public async Task<GoogleStreetViewMetadata> GetStreetViewMetadata(double latitude, double longitude)
        {
            var requestUrl = $"https://maps.googleapis.com/maps/api/streetview/metadata?location={latitude},{longitude}&key={apiKey}";
            var request = new HttpRequestMessage(HttpMethod.Get, requestUrl);

            var response = await httpClient.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync() ??
                throw new Exception("Could not read response content");
            var responseBody = JsonSerializer.Deserialize<GoogleStreetViewMetadata>(responseContent, jsonSerializerOptions) ??
                throw new Exception("Could not deserialize response content");

            return responseBody;
        }
    }
}
