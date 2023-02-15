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
    public class PrevoznikController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public PrevoznikController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Prevoznik.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] PrevoznikAddVM x)
        {
            var newPrevoznik = new Prevoznik
            {
                Naziv = x.Naziv
            };
            _dbContext.Add(newPrevoznik);
            _dbContext.SaveChanges();
            return Get(newPrevoznik.Id);
        }
    }
}
