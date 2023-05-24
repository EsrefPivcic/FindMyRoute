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
    public class AdministratorController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public AdministratorController(ApplicationDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        [HttpGet("id")]
        public ActionResult Get(int id)
        {
            return Ok(_dbContext.Administrator.FirstOrDefault(k => k.id == id));
        }

        [HttpPost]
        public ActionResult Add([FromBody] AdministratorAddVM x)
        {
            var newAdministrator = new Administrator
            {
                Ime = x.Ime.RemoveTags(),
                Prezime = x.Prezime.RemoveTags(),
                Email= x.Email.RemoveTags(),
                korisnickoIme = x.korisnickoIme.RemoveTags(),
                lozinka = x.lozinka.RemoveTags(),
                Adresa = x.Adresa.RemoveTags(),
                BrojTelefona = x.BrojTelefona.RemoveTags(),
                PIN = x.PIN.RemoveTags(),
                posjedujeKreditnu = false,
                isAktiviran = true
            };
            _dbContext.Add(newAdministrator);
            _dbContext.SaveChanges();
            return Get(newAdministrator.id);
        }
    }
}
