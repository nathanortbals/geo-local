using System.ComponentModel.DataAnnotations;

namespace GeoLocal.Game.CreateGame
{
    public class CreateGameRequest
    {
        [Required]
        public string PlaceId { get; init; } = string.Empty;
    }
}
