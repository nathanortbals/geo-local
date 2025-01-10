using GeoLocal.Game.Stages;

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

        private GameService GameService { get; }

        public Game(
            GameBounds bounds,
            IEnumerable<Coordinates> coordinates,
            GameService gameService)
        {
            Id = GenerateGameId();
            Players = [];
            Bounds = bounds;
            CurrentStage = new Lobby(Id, bounds, []);
            Rounds = ConstructRounds(coordinates);
            
            GameService = gameService;
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

            var lobbyPlayers = Players.Select(p => new LobbyPlayer(p.Name, p.Color, p.IsHost)).ToList();
            await UpdateStage(new Lobby(Id, Bounds, lobbyPlayers));
            
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

            var guessingStage = new Guessing(Id, roundNumber, round.Target, Bounds, roundEndsAt, Options.RoundLengthsInSeconds);
            await UpdateStage(guessingStage);

            GameService.ScheduleJob(new GameJob(Id, roundEndsAt, (g) => g.ShowRoundResults(roundNumber)));
        }

        public void SubmitGuess(int roundNumber, string playerName, Coordinates guess)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");

            round.SubmitGuess(playerName, guess);
        }

        public async Task FinalizeGuess(int roundNumber, string playerName)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");
            round.FinalizeGuess(playerName);

            if (round.AllGuessesFinal)
            {
                await ShowRoundResults(roundNumber);
                GameService.CancelNextJob(Id);
            }
        }


        public async Task ShowRoundResults(int roundNumber)
        {
            var round = Rounds.SingleOrDefault(round => round.RoundNumber == roundNumber) ?? throw new Exception($"Round {roundNumber} does not exist.");

            var playerRoundResults = Players
                .Select(p =>
                {
                    var guess = round.Guesses.TryGetValue(p.Name, out var g) ? g : null;
                    var roundScore = guess?.Score ?? 0;
                    var totalScore = p.TotalScore;

                    return new PlayerRoundResults(p.Name, p.Color, p.IsHost, roundScore, totalScore, guess?.Coordinates, guess?.DistanceInMeters);
                })
                .OrderByDescending(p => p.TotalScore)
                .ToList();

            var roundResults = new RoundResults(
                Id,
                round.RoundNumber,
                round.Target,
                playerRoundResults,
                roundNumber == Rounds.Count());

            await UpdateStage(roundResults);
        }

        public async Task ShowFinalResults()
        {
            var playerFinalResults = Players
                .Select(p => new PlayerFinalResults(p.Name, p.Color, p.TotalScore))
                .OrderByDescending(p => p.TotalScore)
                .ToList();

            var finalResult = new FinalResults(Id, playerFinalResults);
            await UpdateStage(finalResult);
        }
 
        public async void PlayAgain(IEnumerable<Coordinates> coordinates)
        {
            Rounds = ConstructRounds(coordinates);

            var lobbyPlayers = Players.Select(p => new LobbyPlayer(p.Name, p.Color, p.IsHost)).ToList();
            await UpdateStage(new Lobby(Id, Bounds, lobbyPlayers));
        }

        public async Task UpdateStage(IStage stage)
        {
            CurrentStage = stage;
            await GameService.UpdateStage(Id, stage);
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
