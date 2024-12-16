namespace GeoLocal.Game
{
    public class Round(int roundNumber, Game game, Coordinates coordinate)
    {
        public int RoundNumber { get; } = roundNumber;

        public Coordinates Coordinate { get; } = coordinate;

        public Coordinates? Guess { get; set; }

        private readonly Game game = game;

        public int Score
        {
            get
            {
                if (Guess is null)
                {
                    return 0;
                }

                var distanceFromGuess = DistanceCalculator.HaversineDistance(Coordinate, Guess);
                if (distanceFromGuess <= 25)
                {
                    return 5000;
                }

                var maxDistance = game.Bounds.RadiusInMeters * 2;
                var score = 5000 * Math.Exp(-10 * (distanceFromGuess / maxDistance));

                return (int)Math.Round(score);
            }
        }
    }
}
