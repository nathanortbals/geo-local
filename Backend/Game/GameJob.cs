namespace GeoLocal.Game
{
    public record GameJob(string GameId, DateTime ExecuteAt, Func<Game, Task> Action)
    {
        public bool ShouldExecute
        {
            get
            {
                return DateTime.UtcNow >= ExecuteAt;
            }
        }
    }
}
