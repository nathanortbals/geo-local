using GeoLocal.Game.Stages;

namespace GeoLocal.Game
{
    public interface IGameClient
    {
        Task ReceiveGameStage(IStage stage);
    }
}
