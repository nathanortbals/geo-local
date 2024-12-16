using GeoLocal.GoogleMaps;
using System;

namespace GeoLocal.Game
{
    public record GameBounds(string Name, Coordinates Center, double Radius, double RadiusInMeters)
    {
        public static GameBounds CalculateBounds(GoogleMapsPlaceResponse place)
        {
            // Find distance to each edge of the viewport
            var distanceToNorth = Math.Abs(place.Location.Latitude - place.ViewPort.High.Latitude);
            var distanceToEast = Math.Abs(place.Location.Longitude - place.ViewPort.High.Longitude);
            var distanceToSouth = Math.Abs(place.Location.Latitude - place.ViewPort.Low.Latitude);
            var distanceToWest = Math.Abs(place.Location.Longitude - place.ViewPort.Low.Longitude);

            // Find the smallest distance to an edge
            var maxRadius = Math.Min(Math.Min(distanceToSouth, distanceToWest), Math.Min(distanceToNorth, distanceToEast));

            // Calculate the distance in meters
            var center = new Coordinates(place.Location.Latitude, place.Location.Longitude);
            var maxRadiusInMeters = DistanceCalculator.HaversineDistance(center, new Coordinates(center.Latitude, center.Longitude + maxRadius));

            return new GameBounds(place.FormattedAddress, center, maxRadius, maxRadiusInMeters);
        }

        public Coordinates GenerateRandomPoint(Random random)
        {
            // Get a random angle of the circle
            var angle = random.NextDouble() * 2 * Math.PI;

            // Generate a weighted radius (sqrt(random) gives more weight near the center)
            var weightedRadius = Math.Sqrt(random.NextDouble()) * Radius;

            // Convert polar coordinates to cartesian coordinates
            var latitude = Center.Latitude + weightedRadius * Math.Cos(angle);
            var longitude = Center.Longitude + weightedRadius * Math.Sin(angle);

            return new Coordinates(latitude, longitude);
        }
    }
}
