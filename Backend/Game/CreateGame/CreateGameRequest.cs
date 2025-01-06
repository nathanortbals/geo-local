using System.ComponentModel.DataAnnotations;

namespace GeoLocal.Game.CreateGame
{
    public class CreateGameRequest
    {
        [Required]
        public int OsmId { get; init; }

        [Required]
        public string Name { get; init; } = string.Empty;
    }
}
