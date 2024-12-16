
namespace GeoLocal.Game.Stages
{
    public record Lobby(string GameId, GameBounds Bounds) : IStage
    {
        public string Type => "Lobby";
    }
}
