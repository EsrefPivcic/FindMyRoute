using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class KupovinaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        public KupovinaController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Kupovina.Include(k => k.Korisnik).Include(k => k.Linija).FirstOrDefault(k => k.Id == id));
        }
        [HttpGet("korisnikId")]
        public ActionResult GetByKorisnik(int korisnikId)
        {
            var data = _dbContext.Kupovina.Include(k => k.Korisnik).Include(k => k.Linija).Include(k => k.Linija.Prevoznik).Where(k => k.Korisnik_id == korisnikId).ToList();
            return Ok(data);
        }
        [HttpPost]
        public ActionResult Add([FromBody] KupovinaAddVM x)
        {
            int cijenaKarte = _dbContext.Linija.Where(l => l.Id == x.Linija_id).FirstOrDefault().Cijena;
            var newKupovina = new Kupovina
            {
                Linija_id= x.Linija_id,
                Korisnik_id = x.Korisnik_id,
                Kolicina = x.Kolicina,
                DatumKupovine = DateTime.Now,
                UkupnaCijena = cijenaKarte * x.Kolicina
            };
            _dbContext.Add(newKupovina);
            _dbContext.SaveChanges();
            return Get(newKupovina.Id);
        }
    }
}
