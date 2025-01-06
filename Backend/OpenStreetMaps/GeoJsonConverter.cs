using NetTopologySuite.Features;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;
using NetTopologySuite.Operation.Linemerge;

namespace GeoLocal.OpenStreetMaps
{
    public static class GeoJsonConverter
    {
        private static readonly LinearRing entireWorld = new([
                new Coordinate(180, 85),
                new Coordinate(90, 85),
                new Coordinate(-90, 85),
                new Coordinate(-180, 85),
                new Coordinate(-180, 0),
                new Coordinate(-180, -85),
                new Coordinate(-90, -85),
                new Coordinate(0, -85),
                new Coordinate(90, -85),
                new Coordinate(180, -85),
                new Coordinate(180, 0),
                new Coordinate(180, 85),
            ]);

        public static (FeatureCollection InsideArea, FeatureCollection OutsideArea) ConvertToGeoJson(OverpassElement element)
        {
            var lines = GetOuterLines(element);

            var linearRings = BuildLinearRings(lines);

            var insideArea = GetInsideArea(linearRings);

            var outsideArea = GetOutsideArea(linearRings);

            var geoJsonWriter = new GeoJsonWriter();
            var geoJson = geoJsonWriter.Write(outsideArea);
            Console.WriteLine(geoJson);

            return (insideArea, outsideArea);
        }

        private static List<LineString> GetOuterLines(OverpassElement overpassElement)
        {
            return overpassElement.Members
                .Where(m => m.Role == "outer")
                .Select(m => m.Geometry.Select(g => new Coordinate(g.Lon, g.Lat)).ToArray())
                .Select(coordinates => new LineString(coordinates))
                .ToList();
        }

        private static List<LinearRing> BuildLinearRings(List<LineString> lines)
        {
            var linearRings = new List<LinearRing>();

            var closedLines = lines.Where(l => l.IsClosed).ToList();
            foreach (var line in closedLines)
            {
                
                var linearRing = new LinearRing(line.Coordinates);
                linearRings.Add(linearRing);
                lines.Remove(line);
            }

            var lineMerger = new LineMerger();
            lineMerger.Add(lines);

            var mergedLines = lineMerger.GetMergedLineStrings();
            foreach (var line in mergedLines)
            {
                var linearRing = new LinearRing(line.Coordinates);
                linearRings.Add(linearRing);
            }

            return linearRings;
        }

        private static FeatureCollection GetInsideArea(List<LinearRing> linearRings)
        {
            var polygons = linearRings.Select(r => new Polygon(r));

            var features = polygons.Select(p => new Feature(p, new AttributesTable()));

            return new FeatureCollection(features);
        }

        private static FeatureCollection GetOutsideArea(List<LinearRing> linearRings)
        {
            var polygon = new Polygon(entireWorld, [.. linearRings]);

            var feature = new Feature(polygon, new AttributesTable());

            return new FeatureCollection([feature]);
        }
    }
}
