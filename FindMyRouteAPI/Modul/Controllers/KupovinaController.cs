using Microsoft.AspNetCore.Mvc;
using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Linq;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class KupovinaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;
        private readonly EmailService _emailService;

        public KupovinaController(ApplicationDbContext dbContext, EmailService emailService = null)
        {
            _dbContext = dbContext;
            _emailService = emailService;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Kupovina.Include(k => k.Korisnik).Include(k => k.Linija).Include(k => k.Linija.Prevoznik).Include(k => k.KreditnaKartica).FirstOrDefault(k => k.Id == id));
        }
        [HttpGet("korisnikId")]
        public ActionResult GetByKorisnik(int korisnikId)
        {
            var data = _dbContext.Kupovina.Include(k => k.Korisnik).Include(k => k.Linija).Include(k => k.Linija.Prevoznik).Include(k=>k.KreditnaKartica).Where(k => k.Korisnik_id == korisnikId).ToList();
            return Ok(data);
        }
        [HttpPost]
        public ActionResult Plati([FromBody] KupovinaAddVM x)
        {
            if (_dbContext.KreditnaKartica.FirstOrDefault(k => k.Korisnik_id == x.Korisnik_id).SigurnosniBroj == x.SigurnosniBroj)
            {
                int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
                var newKupovina = new Kupovina
                {
                    Linija_id = x.Linija_id,
                    Korisnik_id = x.Korisnik_id,
                    KreditnaKartica_id = x.Kreditna_id,
                    Kolicina = x.Kolicina,
                    DatumKupovine = DateTime.Now,
                    DatumVoznje = x.DatumVoznje,
                    UkupnaCijena = cijenaKarte * x.Kolicina
                };
                _dbContext.Add(newKupovina);
                _dbContext.SaveChanges();
                _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
                _dbContext.SaveChanges();
                if (x.Presjedanje != true)
                {
                    KreditnaKartica kreditnaKartica = _dbContext.KreditnaKartica.FirstOrDefault(k => k.Korisnik_id == x.Korisnik_id);
                    string kartica = kreditnaKartica.TipKartice + " kreditna kartica";
                    _emailService.SendEmailPurchase(newKupovina, kartica);
                }
                return Get(newKupovina.Id);
            }
            return BadRequest("Krivi sigurnosni broj kartice!");
        }

        [HttpPost]
        public ActionResult PlatiPresjedanje([FromBody] KupovinaKarticaAddVM x)
        {
            int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
            int kreditnaId = _dbContext.KreditnaKartica.FirstOrDefault(k => k.Korisnik_id == x.Korisnik_id).Id;
            var newKupovina = new Kupovina
            {
                Linija_id = x.Linija_id,
                Korisnik_id = x.Korisnik_id,
                KreditnaKartica_id = kreditnaId,
                Kolicina = x.Kolicina,
                DatumKupovine = DateTime.Now,
                DatumVoznje = x.DatumVoznje,
                UkupnaCijena = cijenaKarte * x.Kolicina
            };
            _dbContext.Add(newKupovina);
            _dbContext.SaveChanges();
            _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
            _dbContext.SaveChanges();
            return Get(newKupovina.Id);
        }

        [HttpPost]
        public ActionResult PlatiPayPal([FromBody] KupovinaAddVM x)
        {
            int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
            var newKupovina = new Kupovina
            {
                Linija_id = x.Linija_id,
                Korisnik_id = x.Korisnik_id,
                Kolicina = x.Kolicina,
                DatumKupovine = DateTime.Now,
                DatumVoznje = x.DatumVoznje,
                UkupnaCijena = cijenaKarte * x.Kolicina,
                PayPalEmail = x.PayPalEmail
            };
            _dbContext.Add(newKupovina);
            _dbContext.SaveChanges();
            _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
            _dbContext.SaveChanges();
            if (x.Presjedanje != true)
            {
                string payPal = "PayPal(" + newKupovina.PayPalEmail + ")";
                _emailService.SendEmailPurchase(newKupovina, payPal);
            }
            return Get(newKupovina.Id);
        }

        [HttpPost]
        public ActionResult PlatiNovomKarticom([FromBody] KupovinaKarticaAddVM x)
        {
            if (x.PoveziKarticu)
            {
                var newKartica = new KreditnaKartica
                {
                    Korisnik_id = x.Korisnik_id,
                    TipKartice = x.TipKartice,
                    BrojKartice = x.BrojKartice,
                    DatumIsteka = x.DatumIsteka,
                    SigurnosniBroj = x.SigurnosniBroj
                };
                Korisnik korisnik;
                korisnik = _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id);
                korisnik.posjedujeKreditnu = true;
                _dbContext.Add(newKartica);
                _dbContext.SaveChanges();
                int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
                var newKupovina = new Kupovina
                {
                    Linija_id = x.Linija_id,
                    Korisnik_id = x.Korisnik_id,
                    KreditnaKartica_id = newKartica.Id,
                    Kolicina = x.Kolicina,
                    DatumKupovine = DateTime.Now,
                    DatumVoznje = x.DatumVoznje,
                    UkupnaCijena = cijenaKarte * x.Kolicina
                };
                _dbContext.Add(newKupovina);
                _dbContext.SaveChanges();
                _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
                _dbContext.SaveChanges();
                if (x.Presjedanje != true)
                {
                    string kartica = newKartica.TipKartice + " kreditna kartica";
                    _emailService.SendEmailPurchase(newKupovina, kartica);
                }
                return Get(newKupovina.Id);
            }
            else
            {
                var kartica = _dbContext.KreditnaKartica.FirstOrDefault(k => k.TipKartice == x.TipKartice && k.BrojKartice == x.BrojKartice &&
                k.DatumIsteka == x.DatumIsteka && k.SigurnosniBroj == x.SigurnosniBroj);
                if (kartica == null)
                {
                    kartica = new KreditnaKartica
                    {
                        TipKartice = x.TipKartice,
                        BrojKartice = x.BrojKartice,
                        DatumIsteka = x.DatumIsteka,
                        SigurnosniBroj = x.SigurnosniBroj
                    };
                    _dbContext.Add(kartica);
                    _dbContext.SaveChanges();
                    int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
                    var newKupovina = new Kupovina
                    {
                        Linija_id = x.Linija_id,
                        Korisnik_id = x.Korisnik_id,
                        KreditnaKartica_id = kartica.Id,
                        Kolicina = x.Kolicina,
                        DatumKupovine = DateTime.Now,
                        DatumVoznje = x.DatumVoznje,
                        UkupnaCijena = cijenaKarte * x.Kolicina
                    };
                    _dbContext.Add(newKupovina);
                    _dbContext.SaveChanges();
                    _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
                    _dbContext.SaveChanges();
                    if (x.Presjedanje != true)
                    {
                        string kartica2 = kartica.TipKartice + " kreditna kartica";
                        _emailService.SendEmailPurchase(newKupovina, kartica2);
                    }
                    return Get(newKupovina.Id);
                }
                else
                {
                    int cijenaKarte = _dbContext.Linija.FirstOrDefault(l => l.Id == x.Linija_id).Cijena;
                    var newKupovina = new Kupovina
                    {
                        Linija_id = x.Linija_id,
                        Korisnik_id = x.Korisnik_id,
                        KreditnaKartica_id = kartica.Id,
                        Kolicina = x.Kolicina,
                        DatumKupovine = DateTime.Now,
                        DatumVoznje = x.DatumVoznje,
                        UkupnaCijena = cijenaKarte * x.Kolicina
                    };
                    _dbContext.Add(newKupovina);
                    _dbContext.SaveChanges();
                    _dbContext.Korisnik.FirstOrDefault(k => k.id == x.Korisnik_id).BrojKupljenihKarata++;
                    _dbContext.SaveChanges();
                    if (x.Presjedanje != true)
                    {
                        string kartica2 = kartica.TipKartice + " kreditna kartica";
                        _emailService.SendEmailPurchase(newKupovina, kartica2);
                    }
                    return Get(newKupovina.Id);
                }           
            }
        }
        [HttpPost]
        public ActionResult PresjedanjeEmail([FromBody] PresjedanjeEmailVM x)
        {
            _emailService.SendEmailPurchaseTransfer(x);
            return Ok();
        }
    }
}
