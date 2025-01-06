using NetTopologySuite.Features;
using NetTopologySuite.Geometries;

namespace GeoLocal.Game
{
    public record GameBounds(int OsmId, string Name, FeatureCollection InsideArea, FeatureCollection OutsideArea, BoundingBox BoundingBox)
    {
        public Coordinates GetRandomCoordinates(Random random)
        {
            while(true)
            {
                var coordinates = BoundingBox.GetRandomCoordinates(random);

                if (IsWithin(coordinates))
                {
                    return coordinates;
                }
            }
        }

        public bool IsWithin(Coordinates coordinates)
        {
            var point = new Point(coordinates.Longitude, coordinates.Latitude);

            return InsideArea.Any(f => f.Geometry.Contains(point));
        }
    }
}
