using GeoLocal.Game;

namespace GeoLocal.Game.Stages
{
    public record RoundResults(
        string GameId,
        int RoundNumber,
        Coordinates Location,
        Coordinates? Guess,
        int Score,
        bool IsFinalRound) : IStage
    {
        public string Type => "RoundResults";

        public double? DistanceInMeters
        {
            get
            {
                return Guess != null ? DistanceCalculator.HaversineDistance(Guess, Location) : null;
            }
        }
    }
}
