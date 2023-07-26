using FindMyRouteAPI.Data;
using FindMyRouteAPI.Helper;
using FindMyRouteAPI.Modul.Models;
using FindMyRouteAPI.Modul.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq.Expressions;

namespace FindMyRouteAPI.Modul.Controllers
{
    //[Authorize]
    [ApiController]
    [Route("[controller]/[action]")]
    public class LinijaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public LinijaController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).FirstOrDefault(k => k.Id == id));
        }

        [HttpGet("prevoznikId")]
        public ActionResult GetByPrevoznik(int prevoznikId)
        {
            var data = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).Where(x => x.Prevoznik_id == prevoznikId).ToList();
            return Ok(data);
        }

        [HttpGet("radnikId")]
        public ActionResult GetByRadnik(int radnikId)
        {
            int prevoznik = _dbContext.RadnikFirme.Include(r => r.Prevoznik).Where(r => r.id == radnikId).FirstOrDefault().Prevoznik.Id;
            return Ok(_dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).Where(l => l.Prevoznik_id == prevoznik).ToList());
        }

        [HttpGet("gradovi")]
        public ActionResult GetByGradovi(string grad1, string grad2)
        {
            var data = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).Where(x => x.Grad1.Naziv.Contains(grad1) && x.Grad2.Naziv.Contains(grad2)).ToList().AsQueryable();
            if (data.Count() == 0)
            {
                var linije1 = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).Where(x => x.Grad1.Naziv.Contains(grad1)).ToList();
                var linije2 = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Include(g => g.Grad1).Include(g => g.Grad2).Where(x => x.Grad2.Naziv.Contains(grad2)).ToList();
                List<LinijeRezultatiVM> linije3 = new List<LinijeRezultatiVM>();
                for (int i = 0; i < linije1.Count(); i++)
                {
                    for (int j = 0; j < linije2.Count(); j++)
                    {
                        if (ProvjeriLinije(linije1[i], linije2[j]))
                        {
                            string NazivPrevoznika;
                            if (linije1[i].Prevoznik.Naziv == linije2[j].Prevoznik.Naziv)
                            {
                                NazivPrevoznika = linije1[i].Prevoznik.Naziv;
                            }
                            else
                            {
                                NazivPrevoznika = linije1[i].Prevoznik.Naziv + " i " + linije2[j].Prevoznik.Naziv;
                            }
                            int linija1dolazak = linije1[i].DolazakSati * 60 + linije1[i].DolazakMinute;
                            int linija2polazak = linije2[j].PolazakSati * 60 + linije2[j].PolazakMinute;
                            int vrijemeCekanja = linija2polazak - linija1dolazak; //znamo da je linija2polazak > od linija1dolazak
                                                                                  //zbog provjere u ProvjeriLinije() -- linija 56
                            LinijeRezultatiVM linija = new LinijeRezultatiVM
                            {
                                Id1 = linije1[i].Id,
                                Id2 = linije2[j].Id,
                                Grad1 = linije1[i].Grad1.Naziv,
                                Presjedanje = linije2[j].Grad1.Naziv,
                                Grad2 = linije2[j].Grad2.Naziv,
                                Prevoznik = NazivPrevoznika,
                                PolazakSati = linije1[i].PolazakSati,
                                PolazakMinute = linije1[i].PolazakMinute,
                                DolazakSati = linije2[j].DolazakSati,
                                DolazakMinute = linije2[j].DolazakMinute,
                                Kilometraza = linije1[i].Kilometraza + linije2[j].Kilometraza,
                                Trajanje = linije1[i].Trajanje + linije2[j].Trajanje,
                                Cijena = linije1[i].Cijena + linije2[j].Cijena,
                                Cekanje = vrijemeCekanja
                            };
                            linije3.Add(linija);
                        }
                    }
                }
                var data2 = linije3.AsQueryable();
                return Ok(data2);
            }
            return Ok(data);
        }

        private bool ProvjeriLinije(Linija linija1, Linija linija2)
        {
            if (linija1.Grad2.Naziv == linija2.Grad1.Naziv)
            {
                int linija1dolazak = linija1.DolazakSati * 60 + linija1.DolazakMinute;
                int linija2polazak = linija2.PolazakSati * 60 + linija2.PolazakMinute;
                if (linija2polazak > linija1dolazak)
                {
                    if (linija1.DaniVoznje.Ponedjeljak == linija2.DaniVoznje.Ponedjeljak && linija2.DaniVoznje.Ponedjeljak == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Utorak == linija2.DaniVoznje.Utorak && linija2.DaniVoznje.Utorak == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Srijeda == linija2.DaniVoznje.Srijeda && linija2.DaniVoznje.Srijeda == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Cetvrtak == linija2.DaniVoznje.Cetvrtak && linija2.DaniVoznje.Cetvrtak == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Petak == linija2.DaniVoznje.Petak && linija2.DaniVoznje.Petak == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Subota == linija2.DaniVoznje.Subota && linija2.DaniVoznje.Subota == true)
                    {
                        return true;
                    }
                    if (linija1.DaniVoznje.Nedjelja == linija2.DaniVoznje.Nedjelja && linija2.DaniVoznje.Nedjelja == true)
                    {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }

        [HttpPost]
        public ActionResult Add([FromBody] LinijaAddVM x)
        {
            var newDaniVoznje = new DaniVoznje
            {
                Ponedjeljak = x.PonedjeljakVoznja,
                Utorak = x.UtorakVoznja,
                Srijeda = x.SrijedaVoznja,
                Cetvrtak = x.CetvrtakVoznja,
                Petak = x.PetakVoznja,
                Subota = x.SubotaVoznja,
                Nedjelja = x.NedjeljaVoznja,
            };
            _dbContext.Add(newDaniVoznje);
            _dbContext.SaveChanges();
            int linijaPolazak = x.PolazakSati * 60 + x.PolazakMinute;
            int linijaDolazak = x.DolazakSati * 60 + x.DolazakMinute;
            var newLinija = new Linija
            {
                Presjedanje = "Direktna linija",
                Grad1_id = x.Grad1_id,
                Grad2_id = x.Grad2_id,
                Prevoznik_id = x.Prevoznik_id,
                PolazakSati = x.PolazakSati,
                PolazakMinute = x.PolazakMinute,
                DolazakSati = x.DolazakSati,
                DolazakMinute = x.DolazakMinute,
                DaniVoznje_id = newDaniVoznje.Id,
                Kilometraza = x.Kilometraza,
                Trajanje = linijaDolazak - linijaPolazak < 0 ? linijaDolazak - linijaPolazak + 1440 : linijaDolazak - linijaPolazak,
                Cijena = x.Cijena
            };
            newLinija.DaniVoznje = _dbContext.DaniVoznje.Find(newDaniVoznje.Id);
            _dbContext.Add(newLinija);
            _dbContext.SaveChanges();
            return Get(newLinija.Id);
        }

        [HttpPost]
        public ActionResult AddByRadnik([FromBody] LinijaAddByRadnikVM x)
        {
            var newDaniVoznje = new DaniVoznje
            {
                Ponedjeljak = x.PonedjeljakVoznja,
                Utorak = x.UtorakVoznja,
                Srijeda = x.SrijedaVoznja,
                Cetvrtak = x.CetvrtakVoznja,
                Petak = x.PetakVoznja,
                Subota = x.SubotaVoznja,
                Nedjelja = x.NedjeljaVoznja,
            };
            _dbContext.Add(newDaniVoznje);
            _dbContext.SaveChanges();
            int linijaPolazak = x.PolazakSati * 60 + x.PolazakMinute;
            int linijaDolazak = x.DolazakSati * 60 + x.DolazakMinute;
            int prevoznik = _dbContext.RadnikFirme.Include(r=>r.Prevoznik).Where(r => r.id == x.Prevoznik_id).FirstOrDefault().Prevoznik.Id;
            Grad grad1 = _dbContext.Grad.Where(g => g.Naziv == x.Grad1).FirstOrDefault();
            if (grad1 == null) {
                grad1 = new Grad
                {
                    Naziv = x.Grad1
                };
                _dbContext.Grad.Add(grad1);
                _dbContext.SaveChanges();
            }
            Grad grad2 = _dbContext.Grad.Where(g => g.Naziv == x.Grad2).FirstOrDefault();
            if (grad2 == null)
            {
                grad2 = new Grad
                {
                    Naziv = x.Grad2
                };
                _dbContext.Grad.Add(grad2);
                _dbContext.SaveChanges();
            }
            var newLinija = new Linija
            {
                Presjedanje = "Direktna linija",
                Grad1_id = grad1.Id,
                Grad2_id = grad2.Id,
                Prevoznik_id = prevoznik,
                PolazakSati = x.PolazakSati,
                PolazakMinute = x.PolazakMinute,
                DolazakSati = x.DolazakSati,
                DolazakMinute = x.DolazakMinute,
                DaniVoznje_id = newDaniVoznje.Id,
                Kilometraza = x.Kilometraza,
                Trajanje = linijaDolazak - linijaPolazak < 0 ? linijaDolazak - linijaPolazak + 1440 : linijaDolazak - linijaPolazak,
                Cijena = x.Cijena
            };
            newLinija.DaniVoznje = _dbContext.DaniVoznje.Find(newDaniVoznje.Id);
            _dbContext.Add(newLinija);
            _dbContext.SaveChanges();
            return Get(newLinija.Id);
        }

        [HttpDelete("{id}")]
        public ActionResult Delete(int id)
        {
            Linija? linija = _dbContext.Linija.Find(id);

            if (linija == null)
                return BadRequest("Pogrešan ID!");

            _dbContext.Remove(linija);

            _dbContext.SaveChanges();
            return Ok(linija);
        }
    }
}
