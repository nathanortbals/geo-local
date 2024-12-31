using GeoLocal.Game.Stages;
using Microsoft.AspNetCore.SignalR;

namespace GeoLocal.Game
{
    public class Game
    {
        public string Id { get; }

        public IList<Player> Players { get; }

        public GameBounds Bounds { get; }

        public Options Options { get; } = new Options(60);

        public IStage CurrentStage { get; private set; }

        public IEnumerable<Round> Rounds { get; private set; }

        public int TotalScore => Rounds.Sum(r => r.Score);

        private GameService gameService { get; }

        public Game(
            GameBounds bounds,
            IEnumerable<Coordinates> coordinates,
            GameService gameService)
        {
            Id = GenerateGameId();
            Players = [];
            Bounds = bounds;
            CurrentStage = new Lobby(Id, bounds, Players);
            Rounds = ConstructRounds(coordinates);
            
            this.gameService = gameService;
        }

        public async Task<string?> JoinGame(string playerName, string connectionId)
        {
            if (Players.Count >= 30)
            {
                return "Game is full";
            }
            else if (Players.Any(p => p.Name.Equals(playerName, StringComparison.CurrentCultureIgnoreCase)))
            {
                return "Name is already taken";
            }

            Players.Add(new Player(playerName, connectionId, this));
            await UpdateStage(new Lobby(Id, Bounds, Players));
            
            return null;
        }

        public async Task StartGame()
        {
            await StartRound(1);
        }

        public async Task StartRound(int roundNumber)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");

            var roundEndsAt = DateTime.UtcNow.AddSeconds(Options.RoundLengthsInSeconds);

            var guessingStage = new Guessing(Id, roundNumber, round.Coordinate, Bounds, roundEndsAt, Options.RoundLengthsInSeconds);
            await UpdateStage(guessingStage);

            gameService.ScheduleJob(new GameJob(Id, roundEndsAt, (g) => g.ShowRoundResults(roundNumber)));
        }

        public void SubmitGuess(int roundNumber, Coordinates guess)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");

            round.Guess = guess;
        }

        public async Task ShowRoundResults(int roundNumber)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");

            var nextStageAt = DateTime.UtcNow.AddSeconds(Options.RoundResultsInSeconds);

            var roundResults = new RoundResults(
                Id,
                round.RoundNumber,
                round.Coordinate,
                round.Guess,
                round.Score,
                roundNumber == Rounds.Count());

            await UpdateStage(roundResults);
        }

        public async Task ShowFinalResults()
        {
            var finalResult = new FinalResults(Id, TotalScore);
            await UpdateStage(finalResult);
        }
 
        public async void PlayAgain(IEnumerable<Coordinates> coordinates)
        {
            Rounds = ConstructRounds(coordinates);
            await UpdateStage(new Lobby(Id, Bounds, Players));
        }

        public async Task UpdateStage(IStage stage)
        {
            CurrentStage = stage;
            await gameService.UpdateStage(Id, stage);
        }

        private static string GenerateGameId()
        {
            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var random = new Random();
            var result = new char[4];

            for (int i = 0; i < 4; i++)
            {
                result[i] = chars[random.Next(chars.Length)];
            }

            return new string(result);
        }

        private List<Round> ConstructRounds(IEnumerable<Coordinates> coordinates) => coordinates
            .Select((coordinate, index) => new Round(index + 1, this, coordinate))
            .ToList();
    }
}
