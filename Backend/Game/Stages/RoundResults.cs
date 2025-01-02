namespace GeoLocal.Game.Stages
{
    public record RoundResults(
        string GameId,
        int RoundNumber,
        Coordinates Target,
        IEnumerable<PlayerRoundResults> Players,
        bool IsFinalRound) : IStage
    {
        public string Type => "RoundResults";
    }

    public record PlayerRoundResults(string PlayerName, string PlayerColor, int RoundScore, int TotalScore, Coordinates? Guess, double? DistanceInMeters);
}
