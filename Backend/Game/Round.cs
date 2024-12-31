namespace GeoLocal.Game
{
    public class Round(int roundNumber, Game game, Coordinates target)
    {
        public int RoundNumber { get; } = roundNumber;

        public Coordinates Target { get; } = target;

        public Dictionary<string, Guess> Guesses = [];

        public Game Game { get; } = game;

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
    }
}
