
namespace GeoLocal.Game.Stages
{
    public record Lobby(string GameId, GameBounds Bounds, IEnumerable<Player> Players) : IStage
    {
        public string Type => "Lobby";
    }
}
