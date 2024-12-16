namespace GeoLocal.GoogleMaps
{
    public class GoogleStreetViewMetadata
    {
        public string Status { get; set; } = string.Empty;

        public LocationInfo Location { get; set; } = new LocationInfo();

        public class LocationInfo
        {
            public double Lat { get; set; } = 0;
            public double Lng { get; set; } = 0;
        }
    }
}
