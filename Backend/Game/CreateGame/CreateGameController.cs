using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace GeoLocal.Game.CreateGame
{
    [ApiController]
    public class CreateGameController(GameFactory gameFactory) : ControllerBase
    {
        [HttpPost("/create-game")]
        [SwaggerOperation("Create Game")]
        [SwaggerResponse(201, "Game created", typeof(CreateGameResponse))]
        public async Task<IActionResult> CreateGame([FromBody] CreateGameRequest createGameRequest)
        {
            var game = await gameFactory.CreateGame(createGameRequest.OsmId, createGameRequest.Name);

            var response = new CreateGameResponse(game.Id);

            return Created("/games/" + game.Id, response);
        }
    }
}
