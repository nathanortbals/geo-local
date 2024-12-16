using GeoLocal.GoogleMaps;
using Microsoft.AspNetCore.SignalR;

namespace GeoLocal.Game
{
    public class GameFactory(GoogleMapsService googleMapsService, GameService gameService)
    {
        public async Task<Game> CreateGame(string placeId)
        {
            var place = await googleMapsService.GetPlace(placeId);

            var bounds = GameBounds.CalculateBounds(place);
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
            var coordinates = new List<Coordinates>();
            var random = new Random();
            var attempt = 0;

            while (coordinates.Count < 5 && attempt < 20)
            {
                var randomCoordinates = bounds.GenerateRandomPoint(random);

                var geoCodeResults = await googleMapsService.ReverseGeocode(randomCoordinates.Latitude, randomCoordinates.Longitude);
                var geocodeResult = geoCodeResults.Results.FirstOrDefault();
                if (geocodeResult is not null)
                {
                    var streetViewMetadata = await googleMapsService.GetStreetViewMetadata(geocodeResult.Geometry.Location.Lat, geocodeResult.Geometry.Location.Lng);
                    if (streetViewMetadata.Status == "OK")
                    {
                        var streetViewCoordinates = new Coordinates(streetViewMetadata.Location.Lat, streetViewMetadata.Location.Lng);
                        coordinates.Add(streetViewCoordinates);
                    }
                }

                attempt++;
            }

            if (coordinates.Count() < 5)
            {
                throw new Exception("Could not find points inside the game bounds");
            }

            return coordinates;
        }
    }
}
