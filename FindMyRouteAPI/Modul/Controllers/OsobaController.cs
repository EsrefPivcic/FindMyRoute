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
    public class OsobaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public OsobaController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Osoba.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] OsobaAddVM x)
        {
            var newKorisnik = new Osoba
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                Email = x.Email.RemoveTags(),
                Password = x.Password.RemoveTags(),
            };
            _dbContext.Add(newKorisnik);
            _dbContext.SaveChanges();
            return Get(newKorisnik.Id);
        }
    }
}
