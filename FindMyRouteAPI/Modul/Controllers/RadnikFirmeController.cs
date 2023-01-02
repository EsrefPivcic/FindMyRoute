using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class RadnikFirmeController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public RadnikFirmeController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.RadnikFirme.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] RadnikFirmeAddVM x)
        {
            var newRadnikFirme = new RadnikFirme
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                Email = x.Email.RemoveTags(),
                Password = x.Password.RemoveTags(),
                Pozicija = x.Pozicija.RemoveTags(),
                RadniStaz = x.RadniStaz
            };
            _dbContext.Add(newRadnikFirme);
            _dbContext.SaveChanges();
            return Get(newRadnikFirme.Id);
        }
    }
}
