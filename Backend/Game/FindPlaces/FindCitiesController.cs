using GeoLocal.Game.FindPlaces;
using GeoLocal.OpenStreetMaps;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace GeoLocal.Game.FindAreas
{
    [ApiController]
    public class FindCitiesController(GeocodingService geocodingService) : ControllerBase
    {

        [HttpGet("/find-cities")]
        [SwaggerOperation("Find Cities")]
        [SwaggerResponse(200, "Cities found", typeof(IEnumerable<FindCitiesResponseItem>))]
        public async Task<IActionResult> GetCities(string search)
        {
            var results = await geocodingService.GetGeocodingResults(search);

            var responseItems = results.Select(r => new FindCitiesResponseItem(r.OsmId, r.Address.FormattedName));

            return Ok(responseItems);
        }
    }
}
