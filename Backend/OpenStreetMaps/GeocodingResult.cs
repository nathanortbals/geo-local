using System.Text.Json.Serialization;

namespace GeoLocal.OpenStreetMaps
{
    public class GeocodingResult
    {
        [JsonPropertyName("osm_id")]
        public int OsmId { get; set; }

        [JsonPropertyName("osm_type")]
        public string OsmType { get; set; } = string.Empty;

        [JsonPropertyName("class")]
        public string? Class { get; set; }

        [JsonPropertyName("address")]
        public GeocodingAddress Address { get; set; } = new GeocodingAddress();

        public class GeocodingAddress
        {
            [JsonPropertyName("city")]
            public string? City { get; set; }

            [JsonPropertyName("town")]
            public string? Town { get; set; }

            [JsonPropertyName("borough")]
            public string? Borough { get; set; }

            [JsonPropertyName("village")]
            public string? Village { get; set; }

            [JsonPropertyName("state")]
            public string State { get; set; } = string.Empty;

            public string FormattedName
            {
                get
                {
                    var city = City ?? Town ?? Borough ?? Village;

                    return $"{city}, {State}";
                }
            }
        }
    }
}
