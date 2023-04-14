using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.EntityFrameworkCore;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class DaniVoznjeController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public DaniVoznjeController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.DaniVoznje.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] DaniVoznjeAddVM x)
        {
            var newDaniVoznje = new DaniVoznje
            {
                Ponedjeljak = x.Ponedjeljak,
                Utorak = x.Utorak,
                Srijeda = x.Srijeda,
                Cetvrtak = x.Cetvrtak,
                Petak = x.Petak,
                Subota = x.Subota,
                Nedjelja = x.Nedjelja,
            };
            _dbContext.Add(newDaniVoznje);
            _dbContext.SaveChanges();
            return Get(newDaniVoznje.Id);
        }
    }
}
