namespace GeoLocal.Game
{
    public record Area(
        Coordinates Center,
        Coordinates SouthWest,
        Coordinates NorthEast);
}
