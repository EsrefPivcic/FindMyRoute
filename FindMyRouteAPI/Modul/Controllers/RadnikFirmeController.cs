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
            return Ok(_dbContext.RadnikFirme.FirstOrDefault(k => k.id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] RadnikFirmeAddVM x)
        {
            var newRadnikFirme = new RadnikFirme
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                Email = x.Email.RemoveTags(),
                korisnickoIme = x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojTelefona = x.BrojTelefona.RemoveTags(),
                Pozicija = x.Pozicija.RemoveTags(),
                RadniStaz = x.RadniStaz,
                Prevoznik_id = x.Prevoznik_id,
                posjedujeKreditnu = false,
                isAktiviran = true
            };
            _dbContext.Add(newRadnikFirme);
            _dbContext.SaveChanges();
            return Get(newRadnikFirme.id);
        }

        [HttpGet]
        public ActionResult<List<RadnikFirme>> GetAll()
        {
            var data = _dbContext.RadnikFirme.Include(r => r.Prevoznik).AsQueryable();
            return data.Take(100).ToList();
        }

        [HttpGet("{id}")]
        public ActionResult GetSlikaDB(int id)
        {
            byte[]? bajtovi_slike = _dbContext.RadnikFirme.Find(id).Slika ?? Fajlovi.Ucitaj("Images/empty.png");
            if (bajtovi_slike == null)
                throw new Exception();
            return File(bajtovi_slike, "image/png");
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            RadnikFirme? radnik = _dbContext.RadnikFirme.Find(id);

            if (radnik == null)
                return BadRequest("pogresan ID");

            _dbContext.Remove(radnik);

            _dbContext.SaveChanges();
            return Ok(radnik);
        }
    }
}
