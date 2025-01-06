namespace GeoLocal.OpenStreetMaps
{
    public class OverpassResponse
    {
        public IEnumerable<OverpassElement> Elements { get; set; } = [];
    }

    public class OverpassElement
    {
        public int Id { get; set; }

        public string Type { get; set; } = string.Empty;

        public OverpassBounds Bounds { get; set; } = new OverpassBounds();

        public IEnumerable<OverpassMember> Members { get; set; } = [];
    }

    public class OverpassBounds
    {
        public double MinLat { get; set; }

        public double MinLon { get; set; }

        public double MaxLat { get; set; }

        public double MaxLon { get; set; }
    }

    public class OverpassMember
    {
        public string Type { get; set; } = string.Empty;

        public string Role { get; set; } = string.Empty;

        public IEnumerable<OverpassGeometry> Geometry { get; set; } = [];
    }

    public class OverpassGeometry
    {
        public double Lat { get; set; }

        public double Lon { get; set; }
    }
}
