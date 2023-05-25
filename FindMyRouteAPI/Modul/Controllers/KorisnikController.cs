using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Modul.ViewModels;
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
                Email= x.Email.RemoveTags(),
                korisnickoIme= x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojTelefona = x.BrojTelefona.RemoveTags(),
                BrojKupljenihKarata = 0,
                posjedujeKreditnu = false,
                isAktiviran = true
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

        [HttpPost]
        public ActionResult PromijeniLozinku([FromBody] PromjenaLozinkeAddVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                if (korisnik.lozinka == x.TrenutnaLozinka)
                {
                    korisnik.lozinka = x.NovaLozinka;
                    _dbContext.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("Pogrešna lozinka");
                }
            }
        }
    }
}
