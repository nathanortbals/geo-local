namespace GeoLocal.Game
{
    public class Round(int roundNumber, Game game, Coordinates target)
    {
        public int RoundNumber { get; } = roundNumber;

        public Coordinates Target { get; } = target;

        public Dictionary<string, Guess> Guesses = [];

        public Game Game { get; } = game;

        public bool AllGuessesFinal
        {
            get
            {
                return Game.Players.All(p => Guesses.TryGetValue(p.Name, out var guess) && guess.Finalized);
            }
        }

        public void SubmitGuess(string playerName, Coordinates coordinates)
        {
            if (Guesses.TryGetValue(playerName, out Guess? value))
            {
                value.UpdateGuess(coordinates);
            }
            else
            {
                Guesses.Add(playerName, new Guess(coordinates, this));
            }
        }

        public void FinalizeGuess(string playerName)
        {
            if (Guesses.TryGetValue(playerName, out Guess? guess))
            {
                guess.FinalizeGuess();
            }
        }
    }
}
