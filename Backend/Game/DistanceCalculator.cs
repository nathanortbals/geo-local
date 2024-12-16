namespace GeoLocal.Game
{
    public class DistanceCalculator
    {
        public static double HaversineDistance(Coordinates c1, Coordinates c2)
        {
            const double r = 6371000; // Earth's radius in meters

            static double ToRadians(double degrees) => degrees * Math.PI / 180;

            double dLat = ToRadians(c1.Latitude - c2.Latitude);
            double dLon = ToRadians(c1.Longitude - c2.Longitude);

            double a = Math.Pow(Math.Sin(dLat / 2), 2) +
                       Math.Cos(ToRadians(c1.Latitude)) * Math.Cos(ToRadians(c2.Latitude)) *
                       Math.Pow(Math.Sin(dLon / 2), 2);

            double c = 2 * Math.Atan2(Math.Sqrt(a), Math.Sqrt(1 - a));

            return r * c; // Distance in meters
        }
    }
}
