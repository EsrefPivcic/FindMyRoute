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

        [HttpGet("korisnikId")]
        public ActionResult GetByKorisnik(int korisnikId)
        {
            var data = _dbContext.KreditnaKartica.Include(k=> k.Korisnik).FirstOrDefault(k => k.Korisnik_id == korisnikId);
            return Ok(data);
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

        [HttpPost]
        public ActionResult Edit([FromBody] KreditnaKarticaEditVM x)
        {
            KreditnaKartica? kartica = _dbContext.KreditnaKartica.Find(x.Id);

            if (kartica == null)
            {
                return BadRequest("Pogresan ID!");
            }
            else
            {
                if (kartica.SigurnosniBroj == x.TrenutniSigBroj)
                {
                    kartica.TipKartice = x.TipKartice == "" ? kartica.TipKartice : x.TipKartice;
                    kartica.BrojKartice = x.BrojKartice == "" ? kartica.BrojKartice : x.BrojKartice;
                    kartica.DatumIsteka = x.DatumIsteka == "" ? kartica.DatumIsteka : x.DatumIsteka;
                    kartica.SigurnosniBroj = x.SigurnosniBroj == "" ? kartica.SigurnosniBroj : x.SigurnosniBroj;
                    _dbContext.SaveChanges();
                    return Ok(kartica);
                }
                else
                {
                    return BadRequest("Pogresan sigurnosni broj!");
                }
            }
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            KreditnaKartica? kartica = _dbContext.KreditnaKartica.Find(id);

            if (kartica == null)
            {
                return BadRequest("Pogresan ID!");
            }
            else
            {
                Korisnik korisnik;
                korisnik = _dbContext.Korisnik.FirstOrDefault(k=> k.id == kartica.Korisnik_id);
                korisnik.posjedujeKreditnu = false;
                kartica.Korisnik_id = null;
                _dbContext.SaveChanges();
                return Ok(kartica);
            }            
        }
    }
}
