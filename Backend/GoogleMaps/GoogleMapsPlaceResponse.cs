namespace GeoLocal.GoogleMaps
{
    public class GoogleMapsPlaceResponse
    {
        public string FormattedAddress { get; set; } = string.Empty;

        public LatLong Location { get; set; } = new();

        public ViewPortInfo ViewPort { get; set; } = new();

        public class ViewPortInfo
        {
            public LatLong Low { get; set; } = new();

            public LatLong High { get; set; } = new();
        }

        public class LatLong
        {
            public double Latitude { get; set; } = 0;
            public double Longitude { get; set; } = 0;
        }
    }
}
