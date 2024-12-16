namespace GeoLocal.Game.CreateGame
{
    public class CreateGameResponse(string gameId)
    {
        public string GameId { get; } = gameId;
    }
}
