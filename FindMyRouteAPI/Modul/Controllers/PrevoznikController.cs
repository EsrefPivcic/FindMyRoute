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
            return Ok(_dbContext.Prevoznik.FirstOrDefault(p => p.Id == id));
        }

        [HttpGet("radnikId")]
        public ActionResult GetByRadnik(int radnikId)
        {
            int prevoznik = _dbContext.RadnikFirme.Include(r => r.Prevoznik).Where(r => r.id == radnikId).FirstOrDefault().Prevoznik.Id;
            return Ok(_dbContext.Prevoznik.FirstOrDefault(p => p.Id == prevoznik));
        }

        [HttpPost]
        public ActionResult Add([FromBody] PrevoznikAddVM x)
        {
            var newPrevoznik = new Prevoznik
            {
                Naziv = x.Naziv,
                Adresa = x.Adresa,
                Email = x.Email,
                BrojTelefona = x.BrojTelefona
            };
            if (!string.IsNullOrEmpty(x.Logo))
            {
                byte[]? slika_bajtovi = x.Logo?.ParsirajBase64();

                if (slika_bajtovi == null)
                    return BadRequest("Format slike nije base64");

                byte[]? slika_bajtovi_resized_velika = Slike.resize(slika_bajtovi, 200);
                byte[]? slika_bajtovi_resized_mala = Slike.resize(slika_bajtovi, 50);
                newPrevoznik.Logo = slika_bajtovi_resized_velika;
                newPrevoznik.LogoMali = slika_bajtovi_resized_mala;
            }
            _dbContext.Add(newPrevoznik);
            _dbContext.SaveChanges();
            return Get(newPrevoznik.Id);
        }

        [HttpGet]
        public ActionResult<List<Prevoznik>> GetAll()
        {
            var data = _dbContext.Prevoznik.AsQueryable();
            return data.Take(100).ToList();
        }

        [HttpPost]
        public ActionResult PromijeniSliku([FromBody] PromjenaSlikeAddVM x)
        {
            Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == x.Id);
            if (prevoznik == null)
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
                    prevoznik.Logo = slika_bajtovi_resized_velika;
                    prevoznik.LogoMali = slika_bajtovi_resized_mala;
                }
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniNaziv([FromBody] PrevoznikEditVM x)
        {
            Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == x.Id);
            if (prevoznik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                prevoznik.Naziv = x.NoviNaziv;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniAdresu([FromBody] PrevoznikEditVM x)
        {
            Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == x.Id);
            if (prevoznik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                prevoznik.Adresa = x.NovaAdresa;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniEmail([FromBody] PrevoznikEditVM x)
        {
            Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == x.Id);
            if (prevoznik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                prevoznik.Email = x.NoviEmail;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpPost]
        public ActionResult PromijeniBroj([FromBody] PrevoznikEditVM x)
        {
            Prevoznik prevoznik = _dbContext.Prevoznik.FirstOrDefault(p => p.Id == x.Id);
            if (prevoznik == null)
            {
                return BadRequest("Pogrešan ID");
            }
            else
            {
                prevoznik.BrojTelefona = x.NoviBrojTelefona;
                _dbContext.SaveChanges();
                return Ok();
            }
        }

        [HttpGet("{id}")]
        public ActionResult GetSlikaDB(int id)
        {
            byte[]? bajtovi_slike = _dbContext.Prevoznik.Find(id).Logo ?? Fajlovi.Ucitaj("Images/prevoznik.png");
            if (bajtovi_slike == null)
                throw new Exception();
            return File(bajtovi_slike, "image/png");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            Prevoznik? prevoznik = _dbContext.Prevoznik.Find(id);

            if (prevoznik == null)
                return BadRequest("pogresan ID");

            _dbContext.Remove(prevoznik);

            _dbContext.SaveChanges();
            return Ok(prevoznik);
        }
    }
}
