namespace GeoLocal.Game.Stages
{
    public record FinalResults(string GameId, int TotalScore) : IStage
    {
        public string Type => "FinalResults";
    }
}
