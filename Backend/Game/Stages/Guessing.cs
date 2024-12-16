namespace GeoLocal.Game.Stages
{
    public record Guessing(
        string GameId,
        int RoundNumber,
        Coordinates Location,
        GameBounds Bounds,
        DateTime RoundEndsAt,
        int TimeLimitSeconds) : IStage
    {
        public string Type => "Guessing";
    }
}
