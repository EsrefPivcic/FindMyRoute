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
        private readonly EmailService _emailService;

        public KorisnikController(ApplicationDbContext dbContext, EmailService emailService = null)
        {
            _dbContext = dbContext;
            _emailService = emailService;
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
                Email = x.Email.RemoveTags(),
                korisnickoIme = x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojTelefona = x.BrojTelefona.RemoveTags(),
                BrojKupljenihKarata = 0,
                posjedujeKreditnu = false,
                isAktiviran = true
            };
            if (!string.IsNullOrEmpty(x.Slika))
            {
                byte[]? slika_bajtovi = x.Slika?.ParsirajBase64();

                if (slika_bajtovi == null)
                    return BadRequest("Format slike nije base64");

                byte[]? slika_bajtovi_resized_velika = Slike.resize(slika_bajtovi, 200);
                byte[]? slika_bajtovi_resized_mala = Slike.resize(slika_bajtovi, 50);
                newKorisnik.Slika = slika_bajtovi_resized_velika;
                newKorisnik.SlikaMala = slika_bajtovi_resized_mala;
            }
            _dbContext.Add(newKorisnik);
            _dbContext.SaveChanges();
            string mail = x.Email;
            string imePrezime = x.Ime + " " + x.Prezime;
            _emailService.SendEmail(mail, imePrezime);
            return Get(newKorisnik.id);
        }

        [HttpGet("{id}")]
        public ActionResult GetSlikaDB(int id)
        {
            byte[]? bajtovi_slike = _dbContext.Korisnik.Find(id).Slika ?? Fajlovi.Ucitaj("Images/empty.png");
            if (bajtovi_slike == null)
                throw new Exception();
            return File(bajtovi_slike, "image/png");
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
        public ActionResult PromijeniSliku([FromBody] PromjenaSlikeAddVM x)
        {
            Korisnik korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Id);
            if (korisnik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                if (!string.IsNullOrEmpty(x.NovaSlika))
                {
                    byte[]? slika_bajtovi = x.NovaSlika?.ParsirajBase64();

                    if (slika_bajtovi == null)
                        return BadRequest("Format slike nije base64");

                    byte[]? slika_bajtovi_resized_velika = Slike.resize(slika_bajtovi, 200);
                    byte[]? slika_bajtovi_resized_mala = Slike.resize(slika_bajtovi, 50);
                    korisnik.Slika = slika_bajtovi_resized_velika;
                    korisnik.SlikaMala = slika_bajtovi_resized_mala;
                }
                _dbContext.SaveChanges();
                return Ok();
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
