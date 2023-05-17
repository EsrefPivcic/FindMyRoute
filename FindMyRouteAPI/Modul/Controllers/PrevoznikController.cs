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
