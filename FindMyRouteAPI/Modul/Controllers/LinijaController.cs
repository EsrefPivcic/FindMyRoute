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
            return Ok(_dbContext.Linija.Include(l => l.Prevoznik).FirstOrDefault(k => k.Id == id));
        }

        [HttpGet("gradovi")]
        public ActionResult GetByGradovi(string grad1, string grad2)
        {
            var data = _dbContext.Linija.Include(l => l.Prevoznik).Where(x=>x.Grad1.Contains(grad1) && x.Grad2.Contains(grad2)).ToList().AsQueryable();
            if (data.Count() == 0)
            {
                var linije1 = _dbContext.Linija.Include(l => l.Prevoznik).Where(x=>x.Grad1.Contains(grad1)).ToList();            
                var linije2 = _dbContext.Linija.Include(l => l.Prevoznik).Where(x=>x.Grad2.Contains(grad2)).ToList();
                List<LinijeRezultatiVM> linije3 = new List<LinijeRezultatiVM>();
                for (int i = 0; i < linije1.Count(); i++)
                {
                    for (int j = 0; j < linije2.Count(); j++)
                    {
                        if (linije1[i].Grad2 == linije2[j].Grad1)
                        {
                            LinijeRezultatiVM linija = new LinijeRezultatiVM
                            {
                                Id1 = linije1[i].Id,
                                Id2 = linije2[j].Id,
                                Grad1 = linije1[i].Grad1,
                                Presjedanje = linije2[j].Grad1,
                                Grad2 = linije2[j].Grad2,
                                Prevoznik = linije1[i].Prevoznik.Naziv + " i " + linije2[j].Prevoznik.Naziv,
                                DatumVrijeme = linije1[i].DatumVrijeme,
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

        [HttpPost]
        public ActionResult Add([FromBody] LinijaAddVM x)
        {
            var newLinija = new Linija
            {
                Grad1= x.Grad1,
                Presjedanje = x.Presjedanje,
                Grad2= x.Grad2,
                Prevoznik_id = x.Prevoznik_id,
                DatumVrijeme = x.DatumVrijeme,
                Kilometraza = x.Kilometraza,
                Trajanje = x.Trajanje,
                Cijena = x.Cijena
            };
            _dbContext.Add(newLinija);
            _dbContext.SaveChanges();
            return Get(newLinija.Id);
        }
    }
}
