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
            return Ok(_dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).FirstOrDefault(k => k.Id == id));
        }

        [HttpGet("gradovi")]
        public ActionResult GetByGradovi(string grad1, string grad2)
        {
            var data = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Where(x=>x.Grad1.Contains(grad1) && x.Grad2.Contains(grad2)).ToList().AsQueryable();
            if (data.Count() == 0)
            {
                var linije1 = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Where(x=>x.Grad1.Contains(grad1)).ToList();            
                var linije2 = _dbContext.Linija.Include(l => l.Prevoznik).Include(d => d.DaniVoznje).Where(x=>x.Grad2.Contains(grad2)).ToList();
                List<LinijeRezultatiVM> linije3 = new List<LinijeRezultatiVM>();
                for (int i = 0; i < linije1.Count(); i++)
                {
                    for (int j = 0; j < linije2.Count(); j++)
                    {
                        if (ProvjeriLinije(linije1[i], linije2[j]))
                        {
                            LinijeRezultatiVM linija = new LinijeRezultatiVM
                            {
                                Id1 = linije1[i].Id,
                                Id2 = linije2[j].Id,
                                Grad1 = linije1[i].Grad1,
                                Presjedanje = linije2[j].Grad1,
                                Grad2 = linije2[j].Grad2,
                                Prevoznik = linije1[i].Prevoznik.Naziv + " i " + linije2[j].Prevoznik.Naziv,
                                //VrijemePolaska = linije1[i].VrijemePolaska,
                                //VrijemeDolaska = linije2[j].VrijemeDolaska,
                                PolazakSati = linije1[i].PolazakSati,
                                PolazakMinute = linije1[i].PolazakMinute,
                                DolazakSati = linije2[j].DolazakSati,
                                DolazakMinute = linije2[j].DolazakMinute,
                                Kilometraza = linije1[i].Kilometraza + linije2[j].Kilometraza,
                                Trajanje = linije1[i].Trajanje + linije2[j].Trajanje,
                                Cijena = linije1[i].Cijena + linije2[j].Cijena
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
            if (linija1.Grad2 == linija2.Grad1)
            {
                int linija1dolazak = int.Parse(linija1.DolazakSati) * 60 + int.Parse(linija1.DolazakMinute);
                int linija2polazak = int.Parse(linija2.PolazakSati) * 60 + int.Parse(linija2.PolazakMinute);
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
            int linijaPolazak = int.Parse(x.PolazakSati) * 60 + int.Parse(x.PolazakMinute);
            int linijaDolazak = int.Parse(x.DolazakSati) * 60 + int.Parse(x.DolazakMinute);
            //var newLinija = new Linija
            //{
            //    Grad1 = x.Grad1,
            //    Presjedanje = x.Presjedanje,
            //    Grad2 = x.Grad2,
            //    Prevoznik_id = x.Prevoznik_id,
            //    //VrijemePolaska = x.VrijemePolaska,
            //    //VrijemeDolaska = x.VrijemeDolaska,
            //    PolazakSati = x.PolazakSati,
            //    PolazakMinute = x.PolazakMinute,
            //    DolazakSati = x.DolazakSati,
            //    DolazakMinute = x.DolazakMinute,
            //    DaniVoznje_id = newDaniVoznje.Id,
            //    DaniVoznje = newDaniVoznje,
            //    Kilometraza = x.Kilometraza,
            //    Trajanje = linijaDolazak - linijaPolazak < 0 ? linijaDolazak - linijaPolazak + 1440 : linijaDolazak - linijaPolazak,
            //    Cijena = x.Cijena
            //};
            //_dbContext.Add(newLinija);
            //_dbContext.SaveChanges();
            var newLinija = new Linija
            {
                Grad1 = x.Grad1,
                Presjedanje = x.Presjedanje,
                Grad2 = x.Grad2,
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
    }
}
