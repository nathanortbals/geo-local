namespace GeoLocal.GoogleMaps
{
    public class GoogleMapsGeocodingResponse
    {
        public IEnumerable<GeocodingResult> Results { get; set; } = [];

        public class GeocodingResult
        {
            public GeocodingGeometry Geometry { get; set; } = new();

            public class GeocodingGeometry
            {
                public GeocodingLocation Location { get; set; } = new();

                public class GeocodingLocation
                {
                    public double Lat { get; set; } = 0;
                    public double Lng { get; set; } = 0;
                }
            }
        }
    }
}
