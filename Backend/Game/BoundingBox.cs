using NetTopologySuite.Features;
using NetTopologySuite.Geometries;

namespace GeoLocal.Game
{
    public record BoundingBox(double MinLatitude, double MinLongitude, double MaxLatitude, double MaxLongitude)
    {
        public double MaximumDistanceInMeters
        {
            get
            {
                var c1 = new Coordinates(MinLatitude, MinLongitude);
                var c2 = new Coordinates(MaxLatitude, MaxLongitude);
                return DistanceCalculator.HaversineDistance(c1, c2);
            }
        }

        public Coordinates GetRandomCoordinates(Random random)
        {
            var latitude = random.NextDouble() * (MaxLatitude - MinLatitude) + MinLatitude;
            var longitude = random.NextDouble() * (MaxLongitude - MinLongitude) + MinLongitude;
            return new Coordinates(latitude, longitude);
        }

        public static BoundingBox FromGeoJson(FeatureCollection featureCollection)
        {
            var envelope = new Envelope();

            foreach (var feature in featureCollection)
            {
                envelope.ExpandToInclude(feature.Geometry.EnvelopeInternal);
            }

            return new BoundingBox(envelope.MinY, envelope.MinX, envelope.MaxY, envelope.MaxX);
        }
    }
}
