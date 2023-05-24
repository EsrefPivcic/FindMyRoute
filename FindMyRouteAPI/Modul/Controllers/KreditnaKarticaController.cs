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
    public class KreditnaKarticaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public KreditnaKarticaController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.KreditnaKartica.FirstOrDefault(k => k.Id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] KreditnaKarticaAddVM x)
        {
            var newKreditna = new KreditnaKartica
            {
                Korisnik_id = x.Korisnik_id,
                TipKartice = x.TipKartice,
                BrojKartice = x.BrojKartice.RemoveTags(),
                DatumIsteka = x.DatumIsteka,
                SigurnosniBroj = x.SigurnosniBroj.RemoveTags()
            };
            Korisnik korisnik;
            korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id);
            korisnik.posjedujeKreditnu = true;
            _dbContext.Add(newKreditna);
            _dbContext.SaveChanges();
            return Get(newKreditna.Id);
        }
    }
}
