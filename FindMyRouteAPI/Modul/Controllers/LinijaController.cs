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
            return Ok(_dbContext.Linija.FirstOrDefault(k => k.Id == id));
        }

        [HttpGet("gradovi")]
        public ActionResult GetByGradovi(string grad1, string grad2)
        {
            //return Ok(_dbContext.Linija.FirstOrDefault(k => k.Grad1 == grad1 && k.Grad2 == grad2));
            var data = _dbContext.Linija.Include(l => l.Prevoznik).Where(x=>x.Grad1.Contains(grad1) && x.Grad2.Contains(grad2)).ToList().AsQueryable();
            return Ok(data);
        }

        [HttpPost]
        public ActionResult Add([FromBody] LinijaAddVM x)
        {
            var newLinija = new Linija
            {
                Grad1= x.Grad1,
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
