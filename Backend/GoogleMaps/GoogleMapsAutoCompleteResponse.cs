namespace GeoLocal.GoogleMaps
{
    public class GoogleMapsAutoCompleteResponse
    {
        public IEnumerable<Suggestion> Suggestions { get; set; } = [];

        public class Suggestion
        {
            public Place PlacePrediction { get; set; } = new Place();

            public class Place
            {
                public string PlaceId { get; set; } = string.Empty;

                public TextInfo Text { get; set; } = new TextInfo();

                public class TextInfo
                {
                    public string Text { get; set; } = string.Empty;
                }
            }
        }
    }
}
