using GeoLocal.Game.CreateGame;
using GeoLocal.Game.Stages;
using GeoLocal.GoogleMaps;
using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Concurrent;

namespace GeoLocal.Game
{
    public class GameService(IHubContext<GameHub, IGameClient> hubContext)
    {
        private readonly List<Game> Games = [];

        public ConcurrentQueue<GameJob> Jobs = new();

        public Game? GetGame(string gameId)
        {
            return Games.FirstOrDefault(game => game.Id == gameId);
        }

        public void AddGame(Game game)
        {
            Games.Add(game);
        }

        public void ScheduleJob(GameJob job)
        {
            Jobs.Enqueue(job);
        }

        public async Task UpdateStage(string gameId, IStage stage)
        {
            await hubContext.Clients.Group(gameId).ReceiveGameStage(stage);
        }
    }
}
