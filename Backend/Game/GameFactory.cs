using GeoLocal.GoogleMaps;
using GeoLocal.OpenStreetMaps;

namespace GeoLocal.Game
{
    public class GameFactory(GoogleMapsService googleMapsService, OverpassService overpassService, GameService gameService)
    {
        public async Task<Game> CreateGame(int osmId, string name)
        {
            var overpassResponse = await overpassService.GetOverpassResponse(osmId);

            var overpassElement = overpassResponse.Elements.FirstOrDefault(e => e.Type == "relation") ??
                throw new Exception($"Could not find geometry for id {osmId}");

            var (insideArea, outsideArea) = GeoJsonConverter.ConvertToGeoJson(overpassElement);

            var boundingBox = new BoundingBox(
                overpassElement.Bounds.MinLat,
                overpassElement.Bounds.MinLon,
                overpassElement.Bounds.MaxLat,
                overpassElement.Bounds.MaxLon);

            var bounds = new GameBounds(
                osmId,
                name,
                insideArea,
                outsideArea,
                boundingBox);

            var coordinates = await GetRandomCoordinatesInsideBounds(bounds);

            var game = new Game(bounds, coordinates, gameService);

            gameService.AddGame(game);

            return game;
        }

        public async Task<IEnumerable<Coordinates>> GetNewCoordinates(Game game)
        {
            var newCoordinates = await GetRandomCoordinatesInsideBounds(game.Bounds);
            return newCoordinates;
        }

        private async Task<IEnumerable<Coordinates>> GetRandomCoordinatesInsideBounds(GameBounds bounds)
        {
            var random = new Random();

            var tasks = Enumerable.Repeat(0, 5).Select(_ => GetRandomCoordinateInsideBounds(random, bounds));
            await Task.WhenAll(tasks);

            return tasks.Select(t => t.Result);
        }

        private async Task<Coordinates> GetRandomCoordinateInsideBounds(Random random, GameBounds bounds)
        {
            var attempt = 0;

            while (attempt < 5)
            {
                var randomCoordinates = bounds.GetRandomCoordinates(random);

                // Get the closest street via reverse geocoding
                var geoCodeResults = await googleMapsService.ReverseGeocode(randomCoordinates.Latitude, randomCoordinates.Longitude);
                var geocodeResult = geoCodeResults.Results.FirstOrDefault();
                if (geocodeResult is null)
                {
                    attempt++;
                    continue;
                }

                // Make sure coordinates are still within the game bounds after reverse geocoding
                var coordinate = new Coordinates(geocodeResult.Geometry.Location.Lat, geocodeResult.Geometry.Location.Lng);
                if (!bounds.IsWithin(coordinate))
                {
                    attempt++;
                    continue;
                }

                // Make sure the street is mapped on Google Street View
                var streetViewMetadata = await googleMapsService.GetStreetViewMetadata(geocodeResult.Geometry.Location.Lat, geocodeResult.Geometry.Location.Lng);
                if (streetViewMetadata.Status == "OK")
                {
                    return coordinate;
                }

                attempt++;
            }

            throw new Exception("Could not find street view coordinates within the game bounds");
        }
    }
}
