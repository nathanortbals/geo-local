namespace GeoLocal.Game
{
    public record Options(int RoundLengthsInSeconds)
    {
        public int RoundResultsInSeconds { get; } = 20;
    }
}
