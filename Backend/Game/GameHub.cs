using GeoLocal.Game.Stages;
using Microsoft.AspNetCore.SignalR;

namespace GeoLocal.Game
{
    public class GameHub(GameService gameService, GameFactory gameFactory) : Hub<IGameClient>
    {
        public async Task JoinGame(string gameId)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return;
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);

            await Clients.Caller.ReceiveGameStage(game.CurrentStage);
        }

        public async Task StartGame(string gameId)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return;
            }

            await game.StartGame();
        }

        public Task SubmitGuess(string gameId, int roundNumber, Coordinates guess)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return Task.CompletedTask;
            }

            game.SubmitGuess(roundNumber, guess);
            return Task.CompletedTask;
        }

        public async Task StartNextRound(string gameId, int roundNumber)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return;
            }

            await game.StartRound(roundNumber);
        }

        public async Task ShowFinalResults(string gameId)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return;
            }

            await game.ShowFinalResults();
        }

        public async Task PlayAgain(string gameId)
        {
            var game = gameService.GetGame(gameId);
            if (game == null)
            {
                return;
            }

            var newCoordinates = await gameFactory.GetNewCoordinates(game);

            game.PlayAgain(newCoordinates);
        }
    }
}
