using GeoLocal.Game.FindPlaces;
using GeoLocal.GoogleMaps;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace GeoLocal.Game.FindAreas
{
    [ApiController]
    public class FindPlacesController(GoogleMapsService googleMapsService) : ControllerBase
    {

        [HttpGet("/find-places")]
        [SwaggerOperation("Find Places")]
        [SwaggerResponse(200, "Places found", typeof(IEnumerable<FindPlacesResponseItem>))]
        public async Task<IActionResult> GetPlaces(string search)
        {
            var places = await googleMapsService.FindPlaces(search);

            var responseItems = places.Suggestions.Select(s => new FindPlacesResponseItem(s.PlacePrediction.PlaceId, s.PlacePrediction.Text.Text));

            return Ok(responseItems);
        }
    }
}
