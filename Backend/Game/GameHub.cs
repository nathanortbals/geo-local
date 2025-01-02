using Microsoft.AspNetCore.SignalR;

namespace GeoLocal.Game
{
    public class GameHub(GameService gameService, GameFactory gameFactory) : Hub<IGameClient>
    {
        public async Task JoinGame(string gameId, string playerName)
        {
            var game = gameService.GetGame(gameId) ?? throw new HubException("Game was not found");
            
            var error = await game.JoinGame(playerName, Context.ConnectionId);
            if (error is not null)
            {
                throw new HubException(error);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
            await Clients.Caller.ReceiveGameStage(game.CurrentStage);
            await Clients.Caller.ReceiveIdentity(playerName);
        }

        public async Task RejoinGame(string gameId, string playerName, string lastConnectionId)
        {
            var game = gameService.GetGame(gameId) ?? throw new HubException("Game was not found");

            var player = game.Players.FirstOrDefault(p => p.Name.Equals(playerName, StringComparison.CurrentCultureIgnoreCase));
            if (player is null)
            {
                return;
            }

            if (player.ConnectionId == lastConnectionId)
            {
                player.Reconnect(Context.ConnectionId);

                await Groups.RemoveFromGroupAsync(lastConnectionId, gameId);
                await Groups.AddToGroupAsync(Context.ConnectionId, gameId);
                await Clients.Caller.ReceiveGameStage(game.CurrentStage);
                await Clients.Caller.ReceiveIdentity(playerName);
            }
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

            var player = game.Players.FirstOrDefault(p => p.ConnectionId == Context.ConnectionId);
            if (player == null)
            {
                return Task.CompletedTask;
            }

            game.SubmitGuess(roundNumber, player.Name, guess);
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
