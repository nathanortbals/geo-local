
namespace GeoLocal.Game.Stages
{
    public record Lobby(string GameId, GameBounds Bounds, IEnumerable<LobbyPlayer> Players) : IStage
    {
        public string Type => "Lobby";
    }

    public record LobbyPlayer(string Name, string Color, bool IsHost);
}
