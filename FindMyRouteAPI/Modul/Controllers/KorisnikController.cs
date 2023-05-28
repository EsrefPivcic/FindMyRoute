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

        [HttpPost]
        public ActionResult PromijeniIme([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.Ime = x.NovoIme;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniPrezime([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.Prezime = x.NovoPrezime;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniEmail([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.Email = x.NoviEmail;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniKorisnickoIme([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.korisnickoIme = x.NovoKorisnickoIme;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniAdresu([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.Adresa = x.NovaAdresa;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniBroj([FromBody] KorisnikEditVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                korisnik.BrojTelefona = x.NoviBrojTelefona;
                _dbContext.SaveChanges();
                return Ok();
            }
        }
    }
}
