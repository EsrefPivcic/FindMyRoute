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
    public class AdministratorController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AdministratorController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Administrator.FirstOrDefault(k => k.id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] AdministratorAddVM x)
        {
            var newAdministrator = new Administrator
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                Email= x.Email.RemoveTags(),
                korisnickoIme = x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojTelefona = x.BrojTelefona.RemoveTags(),
                PIN = x.PIN.RemoveTags(),
                posjedujeKreditnu = false,
                isAktiviran = true
            };
            _dbContext.Add(newAdministrator);
            _dbContext.SaveChanges();
            return Get(newAdministrator.id);
        }

        [HttpGet("{id}")]
        public ActionResult GetSlikaDB(int id)
        {
            byte[]? bajtovi_slike = _dbContext.Administrator.Find(id).Slika ?? Fajlovi.Ucitaj("Images/empty.png");
            if (bajtovi_slike == null)
                throw new Exception();
            return File(bajtovi_slike, "image/png");
        }

        [HttpPost]
        public ActionResult PromijeniLozinku([FromBody] PromjenaLozinkeAddVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                if (administrator.lozinka == x.TrenutnaLozinka)
                {
                    administrator.lozinka = x.NovaLozinka;
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
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
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
                    administrator.Slika = slika_bajtovi_resized_velika;
                    administrator.SlikaMala = slika_bajtovi_resized_mala;
                }
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniIme([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.Ime = x.NovoIme;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniPrezime([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.Prezime = x.NovoPrezime;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniEmail([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.Email = x.NoviEmail;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniKorisnickoIme([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.korisnickoIme = x.NovoKorisnickoIme;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniAdresu([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.Adresa = x.NovaAdresa;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniBroj([FromBody] AdministratorEditVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                administrator.BrojTelefona = x.NoviBrojTelefona;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniPIN([FromBody] PromjenaLozinkeAddVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID!");
            }
            else
            {
                if (administrator.PIN == x.TrenutnaLozinka)
                {
                    administrator.PIN = x.NovaLozinka;
                    _dbContext.SaveChanges();
                    return Ok();
                }
                else
                {
                    return BadRequest("Pogrešan stari PIN!");
                }
            }
        }

        [HttpPost]
        public ActionResult PotvrdiPIN([FromBody] AdministratorPinConfirmVM x)
        {
            Administrator administrator = _dbContext.Administrator.FirstOrDefault(k => k.id == x.Id);
            if (administrator == null)
            {
                return BadRequest("Pogrešan ID!");
            }
            else
            {
                bool potvrda = false; 
                if (administrator.PIN == x.PIN)
                {
                    potvrda = true;
                    return Ok(potvrda);
                }
                else
                {
                    return Ok(potvrda);
                }
            }
        }
    }
}
