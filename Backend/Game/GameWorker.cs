namespace GeoLocal.Game
{
    public class GameWorker(GameService gameService) : BackgroundService
    {
        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while(!stoppingToken.IsCancellationRequested)
            {
                if (gameService.Jobs.TryPeek(out var job) && job.ShouldExecute)
                {
                    if (gameService.Jobs.TryDequeue(out var dequeuedJob))
                    {
                        var game = gameService.GetGame(dequeuedJob.GameId);
                        if (game != null)
                        {
                            await dequeuedJob.Action(game);
                        }
                    }
                }

                await Task.Delay(1000, stoppingToken);
            }
        }
    }
}
