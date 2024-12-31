﻿namespace GeoLocal.Game
{
    public class Player(string name, string connectionId, Game game)
    {
        public string Name { get; } = name;

        public string ConnectionId { get; private set; } = connectionId;

        public string Color { get; } = GetPlayerColor(game);

        public bool IsHost { get; } = game.Players.Count == 0;

        public Game Game { get; } = game;

        public int TotalScore
        {
            get
            {
                return Game.Rounds
                    .Where(r => r.Guesses.ContainsKey(Name))
                    .Select(r => r.Guesses[Name])
                    .Sum(g => g.Score);
            }
        }

        public void Reconnect(string newConnectionId)
        {
            ConnectionId = newConnectionId;
        } 

        private static readonly HashSet<string> colors =
        [
            "#000000", "#00FF00", "#0000FF", "#FF0000", "#01FFFE", "#FFA6FE", "#FFDB66", "#006401",
            "#010067", "#95003A", "#007DB5", "#FF00F6", "#FFEEE8", "#774D00", "#90FB92", "#0076FF",
            "#D5FF00", "#FF937E", "#6A826C", "#FF029D", "#FE8900", "#7A4782", "#7E2DD2", "#85A900",
            "#FF0056", "#A42400", "#00AE7E", "#683D3B", "#BDC6FF", "#263400", "#BDD393", "#00B917",
            "#9E008E", "#001544", "#C28C9F", "#FF74A3", "#01D0FF", "#004754", "#E56FFE", "#788231",
            "#0E4CA1", "#91D0CB", "#BE9970", "#968AE8", "#BB8800", "#43002C", "#DEFF74", "#00FFC6",
            "#FFE502", "#620E00", "#008F9C", "#98FF52", "#7544B1", "#B500FF", "#00FF78", "#FF6E41",
            "#005F39", "#6B6882", "#5FAD4E", "#A75740", "#A5FFD2", "#FFB167", "#009BFF", "#E85EBE"
        ];

        private static string GetPlayerColor(Game game)
        {
            var takenColors = game.Players.Select(p => p.Color).ToHashSet();
            var availableColors = colors.Except(takenColors).ToHashSet();
            var randomColor = availableColors.ElementAt(new Random().Next(availableColors.Count));
            return randomColor;
        }
    }
}
