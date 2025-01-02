namespace GeoLocal.Game.Stages
{
    public record FinalResults(string GameId, IEnumerable<PlayerFinalResults> Players) : IStage
    {
        public string Type => "FinalResults";
    }

    public record PlayerFinalResults(string PlayerName, string PlayerColor, int TotalScore);
}
