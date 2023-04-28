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
    public class KorisnikController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public KorisnikController(ApplicationDbContext dbContext) {
            _dbContext = dbContext;
        }

        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Korisnik.FirstOrDefault(k => k.id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] KorisnikAddVM x)
        {

            var newKorisnik = new Korisnik
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                korisnickoIme= x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojKupljenihKarata = 0
            };
            _dbContext.Add(newKorisnik);
            _dbContext.SaveChanges();
            return Get(newKorisnik.id);
        }

        [HttpGet]
        public ActionResult<List<Korisnik>> GetAll()
        {
            var data = _dbContext.Korisnik.AsQueryable();
            return data.Take(100).ToList();
        }
    }
}
