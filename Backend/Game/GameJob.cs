namespace GeoLocal.Game
{
    public record GameJob(string GameId, DateTime ExecuteAt, Func<Game, Task> Action)
    {
        public bool IsCancelled { get; private set; } = false;

        public bool ShouldExecute
        {
            get
            {
                return DateTime.UtcNow >= ExecuteAt;
            }
        }

        public void Cancel()
        {
            IsCancelled = true;
        }
    }
}
