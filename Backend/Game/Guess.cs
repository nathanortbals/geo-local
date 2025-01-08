namespace GeoLocal.Game
{
    public class Guess(Coordinates coordinates, Round round)
    {
        public Coordinates Coordinates { get; private set; } = coordinates;

        public Round Round { get; } = round;

        public bool Finalized { get; private set; } = false;

        public double DistanceInMeters
        {
            get
            {
                return DistanceCalculator.HaversineDistance(Coordinates, Round.Target);
            }
        }

        public int Score
        {
            get
            {
                var distanceFromGuess = DistanceInMeters;
                if (distanceFromGuess <= 25)
                {
                    return 5000;
                }

                var maxDistance = Round.Game.Bounds.BoundingBox.MaximumDistanceInMeters * 2;
                var score = 5000 * Math.Exp(-10 * (distanceFromGuess / maxDistance));

                return (int)Math.Round(score);
            }
        }

        public void UpdateGuess(Coordinates coordinates)
        {
            Coordinates = coordinates;
        }

        public void FinalizeGuess()
        {
            Finalized = true;
        }
    }
}
